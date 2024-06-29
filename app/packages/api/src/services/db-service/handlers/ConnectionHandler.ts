import { type DBConnector } from '../connectors/DBConnector'

export class ConnectionHandler {
  connections!: Record<number, DBConnector>

  constructor () {
    this.connections = {}
  }

  addConnection (id: number, dbConnector: DBConnector) {
    this.connections[id] = dbConnector
  }

  getConnection (id: number) {
    return this.connections[id]
  }

  removeConnection (id: number) {
    delete this.connections[id]
  }
}
