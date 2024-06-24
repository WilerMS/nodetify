CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  image TEXT,
  birth_date TIMESTAMP
);

CREATE UNIQUE INDEX users_email_uq ON users (email);
CREATE UNIQUE INDEX users_username_uq ON users (username);

CREATE TABLE severity (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  level TEXT CHECK (level IN ('low', 'medium', 'high', 'critical')),
  color TEXT CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

INSERT INTO severity (description, level, color) VALUES
  ('Low severity', 'low', '#98FB98'),
  ('Medium severity', 'medium', '#FFFFCC'),
  ('High severity', 'high', '#FFD700'),
  ('Critical severity', 'critical', '#FF6347');


CREATE TABLE database (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('PostgreSQL', 'MySQL')),
  status TEXT CHECK (status IN ('active', 'inactive', 'connecting', 'error')) DEFAULT 'connecting',
  connection JSON NOT NULL,
  last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_database_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE alarm (
  id SERIAL PRIMARY KEY,
  database_id INT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  table_name TEXT NOT NULL,
  severity_id INT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alarm_database FOREIGN KEY (database_id) REFERENCES database(id),
  CONSTRAINT fk_alarm_severity FOREIGN KEY (severity_id) REFERENCES severity(id)
);

CREATE TABLE condition (
  id SERIAL PRIMARY KEY,
  alarm_id INT NOT NULL,
  column_name TEXT NOT NULL,
  operator TEXT CHECK (operator IN ('=', '!=', '>', '<', '>=', '<=')),
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_condition_alarm FOREIGN KEY (alarm_id) REFERENCES alarm(id)
);

CREATE TABLE alert (
  id SERIAL PRIMARY KEY,
  alarm_id INT NOT NULL,
  message TEXT NOT NULL,
  severity_id INT NOT NULL,
  status TEXT CHECK (status IN ('active', 'resolved', 'ignored')),
  info JSON NOT NULL,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alert_alarm FOREIGN KEY (alarm_id) REFERENCES alarm(id),
  CONSTRAINT fk_alert_severity FOREIGN KEY (severity_id) REFERENCES severity(id)
);

CREATE TABLE alert_history (
  id SERIAL PRIMARY KEY,
  alert_id INT NOT NULL,
  info JSON NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  method TEXT CHECK (method IN ('INSERT', 'UPDATE', 'DELETE')),
  CONSTRAINT fk_alert_history_alert FOREIGN KEY (alert_id) REFERENCES alert(id)
);
