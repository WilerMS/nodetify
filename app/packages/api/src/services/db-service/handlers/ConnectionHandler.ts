import { type DBConnector } from '../connectors/DBConnector'

export class ConnectionHandler {
  private connections!: Record<number, DBConnector>

  constructor () {
    this.connections = {}
  }

  getAllConnections () {
    return Object.values(this.connections)
  }

  getConnection (id: number) {
    return this.connections[id]
  }

  addConnection (id: number, dbConnector: DBConnector) {
    this.connections[id] = dbConnector
  }

  removeConnection (id: number) {
    delete this.connections[id]
  }
}
