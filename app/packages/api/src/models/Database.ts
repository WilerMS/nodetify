import { DATABASE_SECRET_KEY } from '@/config/env'
import { Model } from '@/config/knex'
import { type DatabaseConnection } from '@/types/global'
import { encrypt, decrypt, type EncryptedText } from '@/utils'

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
  schema!: string
  last_checked_at!: string
  created_at!: string
  updated_at!: string

  async $beforeUpsert () {
    if (this.connection) {
      const connetion: string = typeof this.connection === 'string' ? this.connection : JSON.stringify(this.connection)
      // @ts-expect-error: convert connection to string to save the hash in db
      this.connection = encrypt(DATABASE_SECRET_KEY, connetion)
    }
  }

  async $beforeInsert () {
    await this.$beforeUpsert()
  }

  async $beforeUpdate () {
    await this.$beforeUpsert()
  }

  $afterFind () {
    if (typeof this.connection === 'string') {
      const connection = decrypt(DATABASE_SECRET_KEY, this.connection as EncryptedText)
      this.connection = JSON.parse(connection)
    }
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name', 'type', 'connection'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        name: { type: 'string', maxLength: 255 },
        description: { type: 'string' },
        type: { type: 'string', enum: ['PostgreSQL'] },
        status: {
          type: 'string',
          default: 'connecting',
          enum: ['active', 'inactive', 'connecting', 'error']
        },
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
        schema: {
          type: 'string'
        },
        last_checked_at: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
    return {}
  }
}
