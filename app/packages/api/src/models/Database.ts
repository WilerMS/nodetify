import { Model } from '@/config/knex'
import { type DatabaseConnection } from '@/types/global'

export class Database extends Model {
  static tableName = 'database'
  static idColumn = 'id'

  id!: number
  name!: string
  description?: string
  type!: 'PostgreSQL' | 'MySQL' | 'MariaDB' | 'SQLite' | 'SQLServer' | 'Oracle'
  status!: 'active' | 'inactive' | 'connecting' | 'error'
  connection!: DatabaseConnection
  last_checked_at!: string
  created_at!: string
  updated_at!: string

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name', 'type', 'connection'],
      properties: {
        id: { type: 'integer' },
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
