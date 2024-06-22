import { Model } from '@/config/knex'
import { type DatabaseConnection } from '@/types/global'

export class Database extends Model {
  static tableName = 'database'
  static idColumn = 'id'

  id!: number
  name!: string
  description?: string
  user_id!: number
  type!: 'PostgreSQL' | 'MySQL' | 'MariaDB' | 'SQLite' | 'SQLServer' | 'Oracle'
  connection!: DatabaseConnection
  status!: 'active' | 'inactive' | 'connecting' | 'error'
  last_checked_at!: string
  created_at!: string
  updated_at!: string

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name', 'type', 'connection', 'user_id'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        name: { type: 'string', maxLength: 255 },
        description: { type: 'string' },
        type: { type: 'string', enum: ['PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'SQLServer', 'Oracle'] },
        connection: {
          type: 'object',
          properties: {
            host: { type: 'string' },
            port: { type: 'integer' },
            database: { type: 'string' },
            user: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['host', 'port', 'database', 'user', 'password']
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  }

  static get relationMappings () {
    return {}
  }
}
