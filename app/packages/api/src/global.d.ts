import { type Request } from 'express'
import { type User } from '@/models'

declare global {

  interface DatabaseConnection {
    host: string
    port: number
    database: string
    user: string
    password: string
  }

  export interface AuthRequest extends Request {
    auth?: {
      user: User
    }
  }

}
