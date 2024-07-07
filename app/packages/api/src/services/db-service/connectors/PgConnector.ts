import { Client } from 'pg'

import { type DatabaseConnection } from '@/types/global'
import { POSTGRES_QUERIES } from '@/services/db-service/utils/queries'
import { DBConnector } from '@/services/db-service/connectors/DBConnector'
import { type Column, type ColumnInfo, type Schema } from '../utils/types'
import { DB_LOG_MESSAGES } from '../utils/messages'
import { delay } from '@/utils'

// TODO: Mirar si el usuario propuesto tiene los permisos correctos
// TODO: Mejorar los logs usando los nuevos mensajes
export class PgConnector extends DBConnector {
  client!: Client

  constructor (id: number, config: DatabaseConnection) {
    super(id, config)
    this.connect()
  }

  async connect (): Promise<void> {
    try {
      this.client = new Client(this.config)

      this.emit('client.connecting', this)
      this.emit('logger.info', DB_LOG_MESSAGES.CLIENT_CONNECTION_ATTEMPT(this))

      await this.client.connect()
      // Injecting notification function
      await this.client.query(POSTGRES_QUERIES.CREATE_NOTIFY_FUNCTION())
      // Listening to nodetify channel notifications triggers
      await this.client.query('LISTEN nodetify')

      // Start notification's listening
      this.client.on('notification', message => {
        if (!message.payload) return
        this.emit('logger.info', DB_LOG_MESSAGES.CLIENT_NOTIFICATION(this))
        this.emit('client.notification', JSON.parse(message.payload))
      })

      // Caching errors to reconnect automatically
      this.client.on('error', async error => {
        if (this.checkConnectionInterval) {
          clearInterval(this.checkConnectionInterval)
        }
        this.emit('client.error', this)
        this.emit('logger.error', DB_LOG_MESSAGES.CLIENT_CONNECTION_LOST_ERROR(this), error)
        // start reconnection in 1 minute
        setTimeout(this.reconnect.bind(this), 30000)
      })

      this.connected = true
      this.emit('client.connected', this)
      this.emit('logger.info', DB_LOG_MESSAGES.CLIENT_CONNECTION_SUCCESS(this))

      // Check connection each 30 minutes
      this.checkConnectionInterval = setInterval(this.checkConnection.bind(this), 1000 * 60 * 30)
    } catch (error) {
      this.emit('client.error', this)
      this.emit('logger.error', DB_LOG_MESSAGES.CLIENT_CONNECTION_ERROR(this))
      // start reconnection in 1 minute
      setTimeout(this.reconnect.bind(this), 30000)
    }
  }

  // TODO: Implement a max limit of reconnection attemps
  async reconnect (): Promise<void> {
    this.emit('logger.info', DB_LOG_MESSAGES.CLIENT_RECONNECTION_ATTEMPT(this))
    this.connected = false
    await this.client.end()
    await this.connect()
  }

  async disconnect (): Promise<void> {
    this.connected = false
    await this.client.end()
    this.emit('logger.info', DB_LOG_MESSAGES.CLIENT_DISCONNECTION(this))
  }

  async checkConnection (): Promise<void> {
    this.emit('logger.info', DB_LOG_MESSAGES.CLIENT_CHECK_CONNECTION_ATTEMPT(this))
    await delay(2000) // Delay to check connection
    try {
      await this.client.query('SELECT 1')
      this.emit('logger.info', DB_LOG_MESSAGES.CLIENT_CHECK_CONNECTION_SUCCESS(this))
      this.emit('client.checkConnection.success', this)
    } catch (error) {
      this.emit('logger.error', DB_LOG_MESSAGES.CLIENT_CHECK_CONNECTION_ERROR(this))
      this.emit('client.checkConnection.error', this)
      await this.reconnect()
    }
  }

  async getSchema () {
    const data = await this.client.query(POSTGRES_QUERIES.GET_DATABASE_SCHEMAS())
    const rows = data?.rows as ColumnInfo[] ?? []

    const map = new Map<string, Schema>()

    for (const info of rows) {
      let schema = map.get(info.table_schema)
      if (!schema) {
        schema = { name: info.table_schema, tables: [] }
        map.set(info.table_schema, schema)
      }

      let table = schema.tables.find(t => t.name === info.table_name)
      if (!table) {
        table = { name: info.table_name, columns: [] }
        schema.tables.push(table)
      }

      const column: Column = {
        name: info.column_name,
        type: info.data_type,
        nullable: info.is_nullable
      }

      table.columns.push(column)
    }

    return Array.from(map.values())
  }
}
