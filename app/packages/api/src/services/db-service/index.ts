import { logger } from '@/utils'
import { Database } from '@/models'
import { ConnectionHandler } from './handlers/ConnectionHandler'
import { type DbClientNotification } from './connectors/DBConnector'
import { createDatabaseConnection } from './connectors'
import { type PgConnector } from './connectors/PgConnector'

// TODO: add onConnecting to this even handlers
interface EventHandlers {
  onClientNotification: (notification: DbClientNotification) => void
  onClientConnected: (connection: PgConnector) => void
  onClientError: (connection: PgConnector) => void
  onCheckConnectionError: (connection: PgConnector) => void
  onCheckConnectionSuccess: (connection: PgConnector) => void
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

    connection.on('client.connected', connection => {
      events?.onClientConnected?.(connection)
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
    connectionHandler.addConnection(database.id, connection)
  }
}
