import { type DBConnector } from '../connectors'

export const DB_LOG_MESSAGES = {
  CLIENT_CONNECTION_ATTEMPT: (conn: DBConnector) => `[${conn.getClassName()}] - Connecting to database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id}`,
  CLIENT_CONNECTION_SUCCESS: (conn: DBConnector) => `[${conn.getClassName()}] - Connected to database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id}`,
  CLIENT_CONNECTION_ERROR: (conn: DBConnector) => `[${conn.getClassName()}] - Failed to connect to database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id}:`,
  CLIENT_NOTIFICATION: (conn: DBConnector) => `[${conn.getClassName()}] - Notification received from database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id}`,
  CLIENT_CONNECTION_LOST_ERROR: (conn: DBConnector) => `[${conn.getClassName()}] - Connection unexpectedly lost in database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id}:`,
  CLIENT_RECONNECTION_ATTEMPT: (conn: DBConnector) => `[${conn.getClassName()}] - Preparing reconnection to database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id}`,
  CLIENT_DISCONNECTION: (conn: DBConnector) => `[${conn.getClassName()}] - Disconnected from database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id}`,
  CLIENT_CHECK_CONNECTION_ATTEMPT: (conn: DBConnector) => `[${conn.getClassName()}] - Checking connection for database ${conn.config.database} with ID ${conn.id} at ${conn.config.host}:${conn.config.port}.`,
  CLIENT_CHECK_CONNECTION_SUCCESS: (conn: DBConnector) => `[${conn.getClassName()}] - Connection for database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id} remains active.`,
  CLIENT_CHECK_CONNECTION_ERROR: (conn: DBConnector) => `[${conn.getClassName()}] - Connection lost for database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id}, reconnecting...`,
  CLIENT_TRIGGER_INJECTION_ERROR: (conn: DBConnector) => `[${conn.getClassName()}] - Failed to inject nodetify trigger in database ${conn.config.database} at ${conn.config.host}:${conn.config.port} with ID ${conn.id}, reconnecting...`
}
