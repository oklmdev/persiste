import { postgres } from '../postgres'

export async function createUsersTable() {
  try {
    await postgres.query(
      'CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) NOT NULL, password_hash VARCHAR(60), registered_at TIMESTAMPTZ NOT NULL);'
    )
  } catch (error) {
    console.error(error)
  }
}
