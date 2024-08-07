import { Model } from '@/config/knex'
import { type Severity } from './Severity'
import { type Database } from './Database'
import { Condition } from './Condition'
import { type Alert } from './Alert'

interface SeverityType { Severity: typeof Severity }
interface DatabaseType { Database: typeof Database }
interface ConditionType { Condition: typeof Condition }
interface AlertType { Alert: typeof Alert }

export class Alarm extends Model {
  static tableName = 'alarm'
  static idColumn = 'id'

  id!: number
  database_id!: number
  user_id!: number
  name!: string
  description?: string
  table_name!: string
  severity_id!: number
  enabled!: boolean
  created_at!: string
  updated_at!: string

  severity?: Severity
  database?: Database
  condition?: Condition[]
  alerts?: Alert[]

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['user_id', 'database_id', 'name', 'table_name', 'severity_id'],
      properties: {
        id: { type: 'integer' },
        database_id: { type: 'integer' },
        user_id: { type: 'integer' },
        name: { type: 'string', maxLength: 255 },
        description: { type: 'string' },
        table_name: { type: 'string', maxLength: 50 },
        severity_id: { type: 'integer' },
        enabled: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  }

  static get bodySchema () {
    return {
      type: 'object',
      required: ['database_id', 'name', 'table_name', 'severity_id'],
      properties: {
        database_id: { type: 'integer' },
        name: { type: 'string', maxLength: 255 },
        description: { type: 'string' },
        table_name: { type: 'string', maxLength: 50 },
        severity_id: { type: 'integer' },
        condition: {
          type: 'array',
          items: Condition.graphSchema
        }
      }
    }
  }

  static get relationMappings () {
    const { Severity }: SeverityType = require('./Severity')
    const { Database }: DatabaseType = require('./Database')
    const { Condition }: ConditionType = require('./Condition')
    const { Alert }: AlertType = require('./Alert')

    return {
      severity: {
        relation: Model.BelongsToOneRelation,
        modelClass: Severity,
        join: {
          from: 'alarm.severity_id',
          to: 'severity.id'
        }
      },
      database: {
        relation: Model.BelongsToOneRelation,
        modelClass: Database,
        join: {
          from: 'alarm.database_id',
          to: 'database.id'
        }
      },
      condition: {
        relation: Model.HasManyRelation,
        modelClass: Condition,
        join: {
          from: 'alarm.id',
          to: 'condition.alarm_id'
        }
      },
      alerts: {
        relation: Model.HasManyRelation,
        modelClass: Alert,
        join: {
          from: 'alarm.id',
          to: 'alert.alarm_id'
        }
      }
    }
  }
}
