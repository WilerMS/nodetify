import { Model } from '@/config/knex'

export class Severity extends Model {
  id!: number
  description!: string
  level!: 'low' | 'medium' | 'high' | 'critical'
  color!: `#${string}`

  static tableName = 'severity'
  static idColumn = 'id'

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['description', 'level', 'color'],
      properties: {
        id: { type: 'integer' },
        description: { type: 'string', maxLength: 255 },
        level: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' }
      }
    }
  }
}
