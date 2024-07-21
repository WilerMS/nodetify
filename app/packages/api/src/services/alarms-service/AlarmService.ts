import { logger } from '@/utils'
import { type DatabaseService } from '../db-service'
import { type DbClientNotification } from '../db-service/connectors'
import { type DatabaseId, type TableName, type IAlarm, type IAlarmServiceCache } from './interfaces'

export class AlarmService {
  private readonly cache: IAlarmServiceCache = new Map()
  databaseService!: DatabaseService

  constructor(alarms: IAlarm[]) {
    for (const alarm of alarms) {
      const { database_id: dbId, table_name: tablename, id } = alarm
      const tablesCache = this.getOrCreateTableCache(dbId, tablename)
      tablesCache.set(id, alarm)
    }
  }

  getTableAlarms(dbId: DatabaseId, tablename: TableName) {
    const tableAlarms = this.getTableCache(dbId, tablename)
    return Array.from(tableAlarms.values())
  }

  addOrReplaceAlarm(alarm: IAlarm) {
    const { database_id: dbId, table_name: tablename, id } = alarm

    const tablesCache = this.getOrCreateTableCache(dbId, tablename)
    tablesCache.set(id, alarm)

    // TODO: This has to be injected in the database
    this.injectTrigger(alarm)

    return alarm
  }

  removeAlarm(alarm: IAlarm) {
    const tablesCache = this.getTableCache(alarm.database_id, alarm.table_name)
    return tablesCache.delete(alarm.id)
  }

  checkAlarm(notification: DbClientNotification) {
    const alarms = this.getTableAlarms(notification.databaseId, notification.table)
    console.log(alarms[0].condition)
    console.log(notification)
  }

  registerDatabaseServiceInstance(databaseService: DatabaseService) {
    this.databaseService = databaseService
  }

  private async injectTrigger(alarm: IAlarm) {
    const connection = this.databaseService.getConnection(alarm.database_id)

    try {
      const injected = await connection.injectTableTrigger(alarm.table_name)
      return injected
    } catch (error) {
      logger.error(`Failed to inject trigger in database with ID ${connection.id} for the table ${alarm.table_name}`, error)
    }
  }

  private getDatabaseCache(databaseId: DatabaseId) {
    const databaseCache = this.cache.get(databaseId)
    if (!databaseCache) {
      throw new Error('Database connection not found.')
    }
    return databaseCache
  }

  private getTableCache(databaseId: DatabaseId, tablename: TableName) {
    const databaseCache = this.getDatabaseCache(databaseId)
    const tablesCache = databaseCache.get(tablename)
    if (!tablesCache) {
      throw new Error('Tablename not found in cache storage')
    }
    return tablesCache
  }

  private getOrCreateTableCache(databaseId: DatabaseId, tablename: TableName) {
    let databaseCache = this.cache.get(databaseId)
    if (!databaseCache) {
      databaseCache = new Map()
      this.cache.set(databaseId, databaseCache)
    }

    let tablesCache = databaseCache.get(tablename)
    if (!tablesCache) {
      tablesCache = new Map()
      databaseCache.set(tablename, tablesCache)
    }

    return tablesCache
  }
}
