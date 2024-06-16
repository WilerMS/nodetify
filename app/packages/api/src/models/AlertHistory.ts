import { Model } from '@/config/knex'

export class AlertHistory extends Model {
  static tableName = 'alert_history'
  static idColumn = 'id'

  id!: number
  alert_id!: number
  info!: object
  timestamp!: string
  method!: 'INSERT' | 'UPDATE' | 'DELETE'

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['alert_id', 'info', 'timestamp', 'method'],
      properties: {
        id: { type: 'integer' },
        alert_id: { type: 'integer' },
        info: { type: 'object' },
        timestamp: { type: 'string', format: 'date-time' },
        method: { type: 'string', maxLength: 50, enum: ['INSERT', 'UPDATE', 'DELETE'] }
      }
    }
  }

  static get relationMappings () {
    return {}
  }
}
