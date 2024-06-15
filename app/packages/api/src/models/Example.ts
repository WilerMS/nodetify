import { Model } from '@/config/knex'
import { type JSONSchema } from 'objection'

export class Example extends Model {
  id!: number
  message!: string

  static tableName = 'example'
  static idColumn = 'id'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['message'],
    properties: {
      id: { type: 'number' },
      message: { type: 'string' }
    }
  }
}
