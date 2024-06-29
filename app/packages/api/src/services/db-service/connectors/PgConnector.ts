import { Client } from 'pg'

import { type DatabaseConnection } from '@/types/global'
import { POSTGRES_QUERIES } from '@/services/db-service/utils/queries'
import { DBConnector } from '@/services/db-service/connectors/DBConnector'

export class PgConnector extends DBConnector {
  client!: Client

  constructor (id: number, config: DatabaseConnection) {
    super(id, config)
    this.client = new Client(config)
    this.connect()
  }

  async connect (): Promise<void> {
    try {
      this.emit('logger.info', `Connecting to PostgreSQL database ${this.config.database} at ${this.config.host} as user ${this.config.user}`)

      await this.client.connect()
      // Injecting notification function
      await this.client.query(POSTGRES_QUERIES.NOTIFY_FUNCTION())
      // Listening to nodetify channel notifications triggers
      await this.client.query('LISTEN nodetify')

      // Start notification's listening
      this.client.on('notification', message => {
        if (!message.payload) return
        const jsonPayload = JSON.parse(message.payload)
        this.emit('client.notification', jsonPayload)
      })

      // Caching errors to reconnect automatically
      this.client.on('error', error => {
        this.emit('logger.error', `Failed to connect to PostgreSQL database ${this.config.database} at ${this.config.host}: ${error.message}`)
        this.emit('client.error', this)
        // start reconnection in 1 minute
        setTimeout(this.reconnect.bind(this), 60000)
      })

      this.emit('client.connected', this)
      this.emit('logger.info', `Connected to PostgreSQL database ${this.config.database} at ${this.config.host}`)

      // Check connection each 30 minutes
      setInterval(this.checkConnection.bind(this), 1000 * 60 * 30)
    } catch (error) {
      this.emit('logger.error', `Failed to connect to PostgreSQL database ${this.config.database} at ${this.config.host}: ${error as string}`)
      this.emit('client.error', this)
      // start reconnection in 1 minute
      setTimeout(this.reconnect.bind(this), 20000)
    }
  }

  async reconnect (): Promise<void> {
    this.emit('logger.info', `Restarting connection to PostgreSQL database ${this.config.database} at ${this.config.host}`)
    this.client.end()
    await this.connect()
  }

  async disconnect (): Promise<void> {
    this.emit('logger.info', `Disconnected to PostgreSQL database ${this.config.database} at ${this.config.host}`)
    this.client.end()
  }

  async checkConnection (): Promise<void> {
    try {
      await this.client.query('SELECT 1')
      this.emit('logger.info', `PostgreSQL connection for database ${this.config.database} at ${this.config.host} is active.`)
    } catch (error) {
      this.emit('logger.error', `Connection lost for database ${this.config.database} at ${this.config.host}, reconnecting...`)
      await this.reconnect()
    }
  }
}
