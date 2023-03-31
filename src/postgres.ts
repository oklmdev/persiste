import { Pool } from 'pg'
import { POSTGRES_CONNECTION_STRING, NODE_ENV } from './env'

const testConfig = {
  user: 'test',
  host: 'localhost',
  database: 'photos_oklm_test',
  port: 5402,
  allowExitOnIdle: true,
  max: 10,
  idleTimeoutMillis: 2,
}

const devConfig = {
  user: 'admin',
  host: 'localhost',
  database: 'photos_oklm',
  port: 5401,
}

const prodConfig = {
  connectionString: POSTGRES_CONNECTION_STRING,
}

export const postgres = new Pool(
  NODE_ENV === 'production' ? prodConfig : NODE_ENV === 'test' ? testConfig : devConfig
)
