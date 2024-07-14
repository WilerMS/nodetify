import { createDatabaseConnection, type DBConnector } from './connectors'
import { type IDatabaseModel } from './interfaces/IDatabase'
import { type Database } from '@/models'
import { logger } from '@/utils'
import { type IEventHandlers } from './interfaces/IEventHandlers'

interface Options {
  events?: IEventHandlers
}

// TODO: Implementar un límite de intentos de reconexión
// TODO: Cuando se acabe el límite, tengo que guardarlo de alguna manera
// TODO: Así, el usuario le puede dar a reintentar y los intentos de reconexión empiezan de nuevo
export class DatabaseService {
  databaseModel!: IDatabaseModel
  options!: Options

  connections!: Map<number, DBConnector>

  constructor (dbModel: IDatabaseModel, options: Options) {
    this.databaseModel = dbModel
    this.options = options

    this.connections = new Map()
  }

  async start() {
    const databases = await this.databaseModel.query()
    for (const database of databases) {
      this.addConnection(database)
    }
  }

  async stop() {
    const connections = this.getConnections()
    for (const connection of connections) {
      await connection.disconnect()
      this.connections.delete(connection.id)
    }
  }

  getConnection(databaseId: number) {
    const connection = this.connections.get(databaseId)
    if (!connection) {
      throw new Error(`No connection found for database ID: ${databaseId}`)
    }
    return connection
  }

  getConnections() {
    return Array.from(this.connections.values())
  }

  addConnection(database: Database) {
    const connection = createDatabaseConnection(database)
    const { events } = this.options

    connection.on('logger.info', info => logger.info(info))
    connection.on('logger.error', (info, error: Error) => logger.error(info, error?.message))
    connection.on('logger.warn', info => logger.warn(info))

    connection.on('client.connected', connection => {
      events?.onClientConnected?.(connection)
    })

    connection.on('client.connecting', connection => {
      events?.onClientConnecting?.(connection)
    })

    connection.on('client.error', data => {
      events?.onClientError?.(data)
    })

    connection.on('client.notification', data => {
      events?.onClientNotification?.(data)
    })

    connection.on('client.checkConnection.success', data => {
      events?.onCheckConnectionSuccess?.(data)
    })

    connection.on('client.checkConnection.error', data => {
      events?.onCheckConnectionError?.(data)
    })

    // Add connection to the storage
    this.connections.set(database.id, connection)
  }

  async restartConnection(database: Database) {
    const connection = this.getConnection(database.id)
    await connection.reconnect()
  }

  async deleteConnection(database: Database) {
    const connection = this.getConnection(database.id)
    await connection.disconnect()
    this.connections.delete(connection.id)
  }
}
