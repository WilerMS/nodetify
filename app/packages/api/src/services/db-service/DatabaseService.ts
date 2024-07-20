import { logger } from '@/utils'
import { createDatabaseConnection, type DbClientNotification, type DBConnector } from './connectors'
import { type AlarmService } from '../alarms-service'

import {
  type IDatabase,
  type IDatabaseModel,
  type IConnectionCache,
  type Table
} from './interfaces'

// TODO: Implementar un límite de intentos de reconexión
// TODO: Cuando se acabe el límite, tengo que guardarlo de alguna manera
// TODO: Así, el usuario le puede dar a reintentar y los intentos de reconexión empiezan de nuevo
export class DatabaseService {
  connections!: IConnectionCache
  alarmService!: AlarmService
  dbModel!: IDatabaseModel

  constructor (alarmService: AlarmService, dbModel: IDatabaseModel) {
    this.dbModel = dbModel
    this.alarmService = alarmService
    this.connections = new Map()
  }

  async start() {
    const databases = await this.dbModel.query()
    for (const database of databases) {
      this.addConnection(database)
    }
  }

  async stop() {
    const connections = this.getConnections()
    for (const connection of connections) {
      await connection.disconnect()
      this.connections.delete(connection.id)
    }
  }

  getConnection(databaseId: number) {
    const connection = this.connections.get(databaseId)
    if (!connection) {
      throw new Error(`No connection found for database ID: ${databaseId}`)
    }
    return connection
  }

  getConnections() {
    return Array.from(this.connections.values())
  }

  addConnection(database: IDatabase) {
    const connection = createDatabaseConnection(database)
    this.registerEvents(connection)
    this.connections.set(database.id, connection)
  }

  async restartConnection(database: IDatabase) {
    await this.deleteConnection(database)
    this.addConnection(database)
  }

  async deleteConnection(database: IDatabase) {
    const connection = this.getConnection(database.id)
    await connection.disconnect()
    this.connections.delete(connection.id)
  }

  private registerEvents(connection: DBConnector) {
    const events = this.eventHandlers()

    connection.on('logger.info', info => logger.info(info))
    connection.on('logger.error', (info, error: Error) => logger.error(info, error?.message))
    connection.on('logger.warn', info => logger.warn(info))
    connection.on('client.connected', events.onClientConnected)
    connection.on('client.connecting', events.onClientConnecting)
    connection.on('client.error', events.onClientError)
    connection.on('client.checkConnection.success', events.onCheckConnectionSuccess)
    connection.on('client.checkConnection.error', events.onCheckConnectionError)

    connection.on('client.notification', notification => {
      this.handleNotification(notification)
    })
  }

  private handleNotification(notification: DbClientNotification) {
    // TODO: Usar AlarmService.checkAlarm
    // TODO: Recibir confirmación de checkAlarm (Enviar notificación o no?)
    // TODO: Enviar proceso de notificación a una cola de notificaciones
    // TODO: Pasarlo a un método de processNotification
    // TODO: Guardar una alerta o algo en la base de datos de alguna manera (a pensar aun)
    this.alarmService.checkAlarm(notification)
  }

  // TODO: Decidir si dejarlo aquí o separarlo a una clase EventHandlers
  private eventHandlers() {
    const handleConnected = async (conn: DBConnector) => {
      const schema = await conn.getSchema()
      const data = {
        schema: JSON.stringify(schema) as unknown as Table[],
        status: 'active' as const,
        last_checked_at: new Date().toISOString()
      }
      await this.dbModel.query().findById(conn.id).patch(data)
    }

    const updateLastChecked = (status: IDatabase['status']) => {
      return async (conn: DBConnector) => {
        const currentDatetime = new Date().toISOString()
        const data = { status, last_checked_at: currentDatetime }
        await this.dbModel.query().findById(conn.id).patch(data)
      }
    }

    return {
      onClientConnected: handleConnected,
      onCheckConnectionSuccess: handleConnected,
      onClientConnecting: updateLastChecked('connecting'),
      onClientError: updateLastChecked('error'),
      onCheckConnectionError: updateLastChecked('error')
    }
  }
}
