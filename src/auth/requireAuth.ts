import { Request, RequestHandler, Response } from 'express'
import { User } from '../auth/User'

export const requireAuth = (cb: AuthRequestHandler): RequestHandler => {
  return (request, response) => {
    if (!isRequestWithUserSession(request)) {
      if (!request.url || request.url === '/') {
        return response.redirect('/login.html')
      }
      return response.redirect(`/login.html?redirectTo=${request.url}`)
    }

    return cb(request, response)
  }
}

type AuthRequestHandler = (request: AuthenticatedRequest, response: Response) => unknown

type AuthenticatedRequest = Request & { session: { user: User } }

function isRequestWithUserSession(request: Request): request is AuthenticatedRequest {
  if (!request.session.user) {
    return false
  }

  return true
}
