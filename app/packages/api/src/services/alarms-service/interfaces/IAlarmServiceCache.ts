import { type IAlarm } from './IAlarm'

export type DatabaseId = number
export type TableName = string
export type AlarmId = number

export type AlarmsMap = Map<AlarmId, IAlarm>
export type TablesMap = Map<TableName, AlarmsMap>
export type IAlarmServiceCache = Map<DatabaseId, TablesMap>
