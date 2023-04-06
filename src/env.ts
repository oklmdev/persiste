import dotenv from 'dotenv'
dotenv.config()

export const SESSION_SECRET = process.env.SESSION_SECRET!
export const PORT = process.env.PORT!
export const POSTGRES_CONNECTION_STRING = process.env.POSTGRES_CONNECTION_STRING!
export const NODE_ENV = process.env.NODE_ENV!
export const REGISTRATION_CODE = process.env.REGISTRATION_CODE!
export const PASSWORD_SALT = process.env.PASSWORD_SALT!
export const PHOTO_STORAGE = process.env.PHOTO_STORAGE!
export const PHOTO_ACCESS_KEY_ID = process.env.PHOTO_ACCESS_KEY_ID!
export const PHOTO_SECRET_ACCESS_KEY = process.env.PHOTO_SECRET_ACCESS_KEY!
export const PHOTO_BUCKET = process.env.PHOTO_BUCKET!
export const PHOTO_ENDPOINT = process.env.PHOTO_ENDPOINT!
