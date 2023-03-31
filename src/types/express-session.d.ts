import session from 'express-session'
import { User } from '../auth/User'

declare module 'express-session' {
  export interface SessionData {
    user: User
  }
}
