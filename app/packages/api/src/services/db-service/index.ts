import { Database } from '@/models'
import { DatabaseService } from './DatabaseService'
import { type IEventHandlers } from './interfaces/IEventHandlers'
import { type DBConnector } from './connectors'
import { type Table } from './utils/types'

const handleConnected = async (conn: DBConnector) => {
  const schema = await conn.getSchema()
  const data = {
    schema: JSON.stringify(schema) as unknown as Table[],
    status: 'active' as const,
    last_checked_at: new Date().toISOString()
  }
  await Database.query().findById(conn.id).patch(data)
}

const updateLastChecked = (status: Database['status']) => {
  return async (conn: DBConnector) => {
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

export const databaseService = new DatabaseService(
  Database,
  {
    events
  }
)
