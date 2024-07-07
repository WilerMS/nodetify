import { Database } from '@/models'
import { ConnectionHandler } from './handlers'
import { DatabaseService } from './DatabaseService'
import { type IEventHandlers } from './interfaces/IEventHandlers'
import { type PgConnector } from './connectors'

const handleConnected = async (conn: PgConnector) => {
  const schema = await conn.getSchema()
  const data = {
    schema: JSON.stringify(schema),
    status: 'active' as const,
    last_checked_at: new Date().toISOString()
  }
  await Database.query().findById(conn.id).patch(data)
}

const updateLastChecked = (status: Database['status']) => {
  return async (conn: PgConnector) => {
    const data = {
      status,
      last_checked_at: new Date().toISOString()
    }
    await Database.query().findById(conn.id).patch(data)
  }
}

const events: IEventHandlers = {
  onClientConnected: handleConnected,
  onCheckConnectionSuccess: handleConnected,
  onClientNotification: (notification) => {},
  onClientConnecting: updateLastChecked('connecting'),
  onClientError: updateLastChecked('error'),
  onCheckConnectionError: updateLastChecked('error')
}

export const connectionHandler = new ConnectionHandler()
export const databaseService = new DatabaseService(
  connectionHandler,
  Database,
  {
    events
  }
)
