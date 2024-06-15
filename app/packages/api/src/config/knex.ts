import { Model } from 'objection'
import Knex from 'knex'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './env'

export const knexConfig = {
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  }
}

const knex = Knex(knexConfig)

Model.knex(knex)

export { knex, Model }
