import { Model } from '@/config/knex'
import { type Alarm } from './Alarm'

interface AlarmType { Alarm: typeof Alarm }

export class Condition extends Model {
  static tableName = 'condition'
  static idColumn = 'id'

  id!: number
  alarm_id!: number
  column_name!: string
  operator!: '=' | '!=' | '>' | '<' | '>=' | '<='
  value!: string
  created_at!: string
  updated_at!: string

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['alarm_id', 'column_name', 'operator', 'value'],
      properties: {
        id: { type: 'integer' },
        alarm_id: { type: 'integer' },
        column_name: { type: 'string', maxLength: 50 },
        operator: { type: 'string', maxLength: 2, enum: ['=', '!=', '>', '<', '>=', '<='] },
        value: { type: 'string', maxLength: 255 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  }

  static get relationMappings () {
    const { Alarm }: AlarmType = require('./Alarm')

    return {
      alarm: {
        relation: Model.BelongsToOneRelation,
        modelClass: Alarm,
        join: {
          from: 'condition.alarm_id',
          to: 'alarm.id'
        }
      }
    }
  }
}

export default Condition
