import { Model } from '@/config/knex'

export class User extends Model {
  static tableName = 'users'
  static idColumn = 'id'

  id!: number
  name!: string
  username!: string
  password!: string
  image?: string
  birth_date?: string

  static jsonSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      username: { type: 'string' },
      password: { type: 'string' },
      image: { type: 'string' },
      birth_date: { type: 'string' }
    }
  }

  static loginJsonSchema = {
    type: 'object',
    required: ['username', 'password'],
    additionalProperties: false,
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    }
  }

  static registerJsonSchema = {
    type: 'object',
    required: ['name', 'username', 'password'],
    additionalProperties: false,
    properties: {
      name: { type: 'string' },
      username: { type: 'string' },
      image: { type: 'string' },
      gender: { type: 'string' },
      birth_date: { type: 'string' },
      password: { type: 'string' }
    }
  }

  getFormatedDate () {
    return this.birth_date ? new Date(this.birth_date).toISOString().slice(0, 10) : undefined
  }

  toResponse (): User {
    return {
      ...this,
      password: undefined,
      birth_date: this.getFormatedDate()
    }
  }
}
