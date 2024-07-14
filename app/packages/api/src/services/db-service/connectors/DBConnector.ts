import { EventEmitter } from 'stream'
import { type DatabaseConnection } from '@/types/global'
import { type Table } from '../utils/types'

export interface DbClientNotification {
  databaseId: number
  table: string
  type: string
  data: Record<string, any>
}

type ClientEventNames = 'client.connected' | 'client.error' | 'client.checkConnection.error' | 'client.checkConnection.success' | 'client.connecting'
type LoggerEventNames = 'logger.info' | 'logger.error' | 'logger.warn'

type DbConnectorEvent<T> =
  ((event: LoggerEventNames, listener: (text: string, ...args: any[]) => void) => T) &
  ((event: 'client.notification', listener: (notification: DbClientNotification) => void) => T) &
  ((event: ClientEventNames, listener: (obj: T) => void) => T)

export declare interface DBConnector {
  on: DbConnectorEvent<this>
}

export abstract class DBConnector extends EventEmitter {
  id!: number
  config!: DatabaseConnection
  connected: boolean = false
  checkConnectionInterval: NodeJS.Timeout | null = null

  constructor (id: number, config: DatabaseConnection) {
    super()
    this.id = id
    this.config = config
  }

  async connect (): Promise<void> {
    throw new Error("Method 'connect()' must be implemented.")
  }

  async reconnect (): Promise<void> {
    throw new Error("Method 'reconnect()' must be implemented.")
  }

  async disconnect (): Promise<void> {
    throw new Error("Method 'disconnect()' must be implemented.")
  }

  async checkConnection (): Promise<void> {
    throw new Error("Method 'checkConnection()' must be implemented.")
  }

  async getSchema (): Promise<Table[]> {
    throw new Error("Method 'getSchema()' must be implemented.")
  }

  getClassName (): string {
    return this.constructor.name
  }

  /**
   * Map each database column type and associates it with a simple jsonschema type
   * @param columnType string
   */
  mapColumnTypeToBasicType (columnType: string): 'number' | 'string' | 'boolean' {
    throw new Error("Method 'mapColumnTypeToBasicType()' must be implemented.")
  }
}
