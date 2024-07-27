import { type Database } from '@/models'
import { type DBConnector, type PgConnector } from '../connectors'

export type IDatabaseModel = typeof Database
export interface IDatabase extends Database {}

export interface IEventHandlers {
  onClientConnected: (connection: PgConnector) => void
  onClientConnecting: (connection: PgConnector) => void
  onClientError: (connection: PgConnector) => void
  onCheckConnectionError: (connection: PgConnector) => void
  onCheckConnectionSuccess: (connection: PgConnector) => void
}

export type IConnectionCache = Map<number, DBConnector>

export interface ColumnInfo {
  table_schema: string
  table_name: string
  column_name: string
  data_type: string
  is_nullable: boolean
}

export interface Column {
  name: string
  type: 'number' | 'string' | 'boolean'
  nullable: boolean
}

export interface Table {
  name: string
  columns: Column[]
}

export type ISchema = Table[]
