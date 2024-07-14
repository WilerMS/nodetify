import { type PgConnector } from '../connectors'

export interface IEventHandlers {
  onClientConnected: (connection: PgConnector) => void
  onClientConnecting: (connection: PgConnector) => void
  onClientError: (connection: PgConnector) => void
  onCheckConnectionError: (connection: PgConnector) => void
  onCheckConnectionSuccess: (connection: PgConnector) => void
}
