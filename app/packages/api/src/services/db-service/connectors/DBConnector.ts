import { EventEmitter } from 'stream'
import { type DatabaseConnection } from '@/types/global'

export interface DbClientNotification {
  table: string
  type: string
  data: Record<string, any>
}

type DbConnectorEvent<T> =
  ((event: 'logger.info' | 'logger.error' | 'logger.warn', listener: (text: string) => void) => T) &
  ((event: 'client.notification', listener: (notification: DbClientNotification) => void) => T) &
  ((event: 'client.connected' | 'client.error' | 'client.checkConnection.error' | 'client.checkConnection.success', listener: (obj: T) => void) => T) /* &
  ((event: 'client.error', listener: (obj: T) => void) => T) &
  ((event: 'client.checkConnection.error', listener: (obj: T) => void) => T) &
  ((event: 'client.checkConnection.success', listener: (obj: T) => void) => T) */

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
}
