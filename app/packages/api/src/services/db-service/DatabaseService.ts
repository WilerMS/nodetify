import { type ConnectionHandler } from './handlers'
import { createDatabaseConnection } from './connectors'
import { type IDatabase } from './interfaces/IDatabase'
import { type Database } from '@/models'
import { logger } from '@/utils'
import { type IEventHandlers } from './interfaces/IEventHandlers'

interface Options {
  events?: IEventHandlers
}

export class DatabaseService {
  connectionHandler!: ConnectionHandler
  databaseModel!: IDatabase
  options!: Options

  constructor (
    connectionHandler: ConnectionHandler,
    databaseModel: IDatabase,
    options: Options
  ) {
    this.connectionHandler = connectionHandler
    this.databaseModel = databaseModel
    this.options = options
  }

  async start () {
    const databases = await this.databaseModel.query()
    for (const database of databases) {
      this.addDatabaseConnection(database)
    }
  }

  async stop () {
    const connections = this.connectionHandler.getAllConnections()
    for (const connection of connections) {
      await connection.disconnect()
      this.connectionHandler.removeConnection(connection.id)
    }
  }

  addDatabaseConnection (database: Database) {
    const connection = createDatabaseConnection(database)
    const { events } = this.options

    connection.on('logger.info', info => logger.info(info))
    connection.on('logger.error', info => logger.error(info))
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
    this.connectionHandler.addConnection(database.id, connection)
  }

  getDatabaseConnection (databaseId: number) {
    const connection = this.connectionHandler.getConnection(databaseId)
    if (!connection) {
      throw new Error(`No connection found for database ID: ${databaseId}`)
    }
    return connection
  }
}
