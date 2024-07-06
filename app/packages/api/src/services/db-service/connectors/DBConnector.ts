import { EventEmitter } from 'stream'
import { type DatabaseConnection } from '@/types/global'
import { type Schema } from '../types'

export interface DbClientNotification {
  table: string
  type: string
  data: Record<string, any>
}

type ClientEventNames = 'client.connected' | 'client.error' | 'client.checkConnection.error' | 'client.checkConnection.success'
type LoggerEventNames = 'logger.info' | 'logger.error' | 'logger.warn'

type DbConnectorEvent<T> =
  ((event: LoggerEventNames, listener: (text: string) => void) => T) &
  ((event: 'client.notification', listener: (notification: DbClientNotification) => void) => T) &
  ((event: ClientEventNames, listener: (obj: T) => void) => T)

export declare interface DBConnector {
  on: DbConnectorEvent<this>
}

export abstract class DBConnector extends EventEmitter {
  id!: number
  config!: DatabaseConnection
  connected: boolean = false

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

  async getSchema (): Promise<Schema[]> {
    throw new Error("Method 'getSchema()' must be implemented.")
  }
}
