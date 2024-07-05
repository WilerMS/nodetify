import { logger } from '@/utils'
import { Database } from '@/models'
import { ConnectionHandler } from './handlers/ConnectionHandler'
import { type DbClientNotification, type DBConnector } from './connectors/DBConnector'
import { createDatabaseConnection } from './connectors'

interface EventHandlers {
  onClientNotification: (notification: DbClientNotification) => void
  onClientConnected: (connection: DBConnector) => void
  onClientError: (connection: DBConnector) => void
}

interface StartDbServiceOptions {
  events?: EventHandlers
}

export const connectionHandler = new ConnectionHandler()

export const startDbService = async ({ events }: StartDbServiceOptions) => {
  const databases = await Database.query()

  for (const database of databases) {
    const connection = createDatabaseConnection(database)

    connection.on('logger.info', info => logger.info(info))
    connection.on('logger.error', info => logger.error(info))
    connection.on('logger.warn', info => logger.warn(info))

    connection.on('client.connected', (connection) => {
      events?.onClientConnected?.(connection)
    })

    connection.on('client.error', (connection) => {
      events?.onClientError?.(connection)
    })

    connection.on('client.notification', (data) => {
      events?.onClientNotification?.(data)
    })

    // Add connection to the storage
    connectionHandler.addConnection(database.id, connection)
  }
}
