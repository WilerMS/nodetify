import { Model } from '@/config/knex'
import { type Alarm } from './Alarm'
import { type Severity } from './Severity'

interface AlarmType { Alarm: typeof Alarm }
interface SeverityType { Severity: typeof Severity }

export class Alert extends Model {
  static tableName = 'alert'
  static idColumn = 'id'

  id!: number
  alarm_id!: number
  message!: string
  severity_id!: number
  status?: 'active' | 'resolved' | 'ignored'
  resolved_at?: string
  info!: object
  created_at!: string
  updated_at!: string

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['alarm_id', 'message', 'severity_id', 'info'],
      properties: {
        id: { type: 'integer' },
        alarm_id: { type: 'integer' },
        message: { type: 'string' },
        severity_id: { type: 'integer' },
        status: { type: 'string', maxLength: 50, enum: ['active', 'resolved', 'ignored'] },
        resolved_at: { type: 'string', format: 'date-time' },
        info: { type: 'object' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  }

  static get relationMappings () {
    const { Alarm }: AlarmType = require('./Alarm')
    const { Severity }: SeverityType = require('./Severity')

    return {
      alarm: {
        relation: Model.BelongsToOneRelation,
        modelClass: Alarm,
        join: {
          from: 'alert.alarm_id',
          to: 'alarm.id'
        }
      },
      severity: {
        relation: Model.BelongsToOneRelation,
        modelClass: Severity,
        join: {
          from: 'alert.severity_id',
          to: 'severity.id'
        }
      }
    }
  }
}
