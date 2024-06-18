import { config } from 'dotenv'

config()

export const PORT = process.env.PORT!
export const DB_NAME = process.env.DB_NAME!
export const DB_PORT = process.env.DB_PORT!
export const DB_USER = process.env.DB_USER!
export const DB_PASSWORD = process.env.DB_PASSWORD!
export const DB_HOST = process.env.DB_HOST!
export const JWT_SECRET = process.env.JWT_SECRET!
export const DEVELOPMENT = process.env.NODE_ENV === 'development'
export const PRODUCTION = process.env.NODE_ENV === 'production'
