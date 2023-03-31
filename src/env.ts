import dotenv from 'dotenv'
dotenv.config()

export const SESSION_SECRET = process.env.SESSION_SECRET!
export const PORT = process.env.PORT!
export const POSTGRES_CONNECTION_STRING = process.env.POSTGRES_CONNECTION_STRING!
export const NODE_ENV = process.env.NODE_ENV!
