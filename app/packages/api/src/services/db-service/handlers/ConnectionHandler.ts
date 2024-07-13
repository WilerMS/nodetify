import { type DBConnector } from '../connectors/DBConnector'

export class ConnectionHandler {
  private connections!: Map<number, DBConnector>

  constructor () {
    this.connections = new Map()
  }

  getAllConnections () {
    return Array.from(this.connections.values())
  }

  getConnection (id: number) {
    return this.connections.get(id)
  }

  addConnection (id: number, dbConnector: DBConnector) {
    this.connections.set(id, dbConnector)
  }

  removeConnection (id: number) {
    this.connections.delete(id)
  }
}
