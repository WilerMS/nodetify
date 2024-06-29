import { EventEmitter } from 'stream'
import { type DatabaseConnection } from '@/types/global'

interface Notification {
  table: string
  type: string
  data: Record<string, any>
}

export declare interface DBConnector {
  on:
  ((event: 'logger.info' | 'logger.error' | 'logger.warn', listener: (text: string) => void) => this) &
  ((event: 'client.notification', listener: (notification: Notification) => void) => this) &
  ((event: 'client.connected', listener: (obj: this) => void) => this) &
  ((event: 'client.error', listener: (obj: this) => void) => this)
}

export abstract class DBConnector extends EventEmitter {
  id!: number
  config!: DatabaseConnection

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
