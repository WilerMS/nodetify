import { type IAlarm } from './IAlarm'

type DatabaseId = number
type TableName = string
type AlarmId = number

type AlarmsMap = Map<AlarmId, IAlarm>

type TablesMap = Map<TableName, AlarmsMap>

export type ICache = Map<DatabaseId, TablesMap>
