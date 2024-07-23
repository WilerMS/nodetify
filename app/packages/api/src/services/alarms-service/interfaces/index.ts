import { type Alarm } from '@/models'

export type IAlarmModel = typeof Alarm
export interface IAlarm extends Alarm {}

export type DatabaseId = number
export type TableName = string
export type AlarmId = number

export type AlarmsMap = Map<AlarmId, IAlarm>
export type TablesMap = Map<TableName, AlarmsMap>
export type IAlarmServiceCache = Map<DatabaseId, TablesMap>
