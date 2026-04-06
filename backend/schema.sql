CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  nin VARCHAR(20),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  balance NUMERIC(18,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ajo_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contribution_amount NUMERIC(18,2) NOT NULL,
  cycle_days INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ajo_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES ajo_groups(id),
  user_id INTEGER REFERENCES users(id),
  position INTEGER NOT NULL,
  has_received BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(20) NOT NULL,
  amount NUMERIC(18,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
