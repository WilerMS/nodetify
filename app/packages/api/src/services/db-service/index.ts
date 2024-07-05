import { logger } from '@/utils'
import { Database } from '@/models'
import { PgConnector } from './connectors/PgConnector'
import { ConnectionHandler } from './handlers/ConnectionHandler'
import { type DbClientNotification, type DBConnector } from './connectors/DBConnector'

interface EventHandlers {
  handleNotification: (notification: DbClientNotification) => void
  handleClientConnected: (connection: DBConnector) => void
  handleClientError: (connection: DBConnector) => void
}

interface StartDbServiceOptions {
  eventHandlers?: EventHandlers
}

export const connectionHandler = new ConnectionHandler()

export const startDbService = async ({ eventHandlers }: StartDbServiceOptions) => {
  const databases = await Database.query()

  for (const database of databases) {
    const connection = new PgConnector(database.id, database.connection)

    connection.on('logger.info', logger.info)
    connection.on('logger.error', logger.error)
    connection.on('logger.warn', logger.warn)

    connection.on('client.connected', (connection) => {
      eventHandlers?.handleClientConnected?.(connection)
    })

    connection.on('client.error', (connection) => {
      eventHandlers?.handleClientConnected?.(connection)
    })

    connection.on('client.notification', (data) => {
      eventHandlers?.handleNotification?.(data)
    })

    // Add connection to the storage
    connectionHandler.addConnection(database.id, connection)
  }
}
