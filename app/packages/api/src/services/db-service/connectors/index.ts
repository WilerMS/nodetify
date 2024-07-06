import { type Database } from '@/models'
import { PgConnector } from './PgConnector'

export * from './DBConnector'
export * from './PgConnector'

export const createDatabaseConnection = (database: Database) => {
  if (database.type === 'PostgreSQL') {
    return new PgConnector(database.id, database.connection)
  }
  /* if (database.type === 'MySQL') {
    return new DB()
  } */

  throw new Error(
    `Error during connection for the next database:
    ID: ${database.id}
    Name: ${database.name}
    Host: ${database.connection.host}
    Port: ${database.connection.port}
    User: ${database.connection.user}`
  )
}
