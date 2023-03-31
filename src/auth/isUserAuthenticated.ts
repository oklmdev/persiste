import { Request, Response } from 'express'
import { User } from './User'

export const isUserAuthenticated = (request: Request, response: Response): request is Request & { session: { user: User } } => {
  if (!request.session.user) {
    console.log('Cannot find user session, redirecting to login')
    response.redirect(`/login.html?redirectTo=${request.url}`)
    return false
  }

  return true
}
