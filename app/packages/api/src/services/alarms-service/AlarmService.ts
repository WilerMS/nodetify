import { type DatabaseService } from '../db-service/DatabaseService'
import { type IAlarm } from './interfaces/IAlarm'

type AlarmsMap = Map<number, IAlarm>
type Cache = Map<number, Map<string, AlarmsMap>>

export class AlarmService {
  cache!: Cache
  dbService!: DatabaseService

  constructor(dbService: DatabaseService) {
    this.dbService = dbService
    this.cache = new Map()
  }

  start(alarms: IAlarm[]) {
    for (const alarm of alarms) {
      this.addAlarm(alarm)
    }
  }

  getTableAlarms(databaseId: number, tablename: string) {
    const database = this.cache.get(databaseId)
    if (!database) throw new Error('Database connection not found')

    const tableAlarms = database?.get(tablename)
    if (!tableAlarms) throw new Error('Tablename not found in cache storage')

    return Array.from(tableAlarms?.values())
  }

  addAlarm(alarm: IAlarm) {
    const { database_id: dbId, table_name: tablename, id } = alarm

    if (!this.cache.has(dbId)) {
      this.cache.set(dbId, new Map())
    }

    if (!this.cache.get(dbId)?.has(tablename)) {
      this.cache.get(dbId)?.set(tablename, new Map())
    }

    this.cache.get(dbId)?.get(tablename)?.set(id, alarm)

    // Add the current alarm to notification evennt of its own database connection
    this.registerAlarmToDatabaseService(alarm)
  }

  removeAlarm(alarm: IAlarm) {
    this.cache
      .get(alarm.database_id)
      ?.get(alarm.table_name)
      ?.delete(alarm.id)
  }

  // Method used to verify alarms when a notification gets triggered
  /* checkAlarms(notification: DbClientNotification) {
    const { databaseId, table, type, data } = notification

    const alarms = this.getTableAlarms(databaseId, table)

    console.log('Procesing notification in Alarm service')
    console.log(alarms)
    console.log(notification)
  } */

  /**
   * Method to register alarms to the notification events on each connection
   * @param alarm IAlarm
   */
  async registerAlarmToDatabaseService(alarm: IAlarm) {
    try {
      const connection = this.dbService.getConnection(alarm.database_id)

      await connection.injectTableTrigger(alarm.table_name)

      connection.on('client.notification', (notification) => {
        console.log('llegó la notificación. Que vaina', notification)
      })
    } catch (error) {
      console.log(error)
    }
  }
}
