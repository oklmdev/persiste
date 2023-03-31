import { RequestHandler } from 'express'

export const requireAuth = (): RequestHandler => {
  return (request, response, next) => {
    if (!request.session.user) {
      console.log('Cannot find user session, redirecting to login')
      return response.redirect(`/login.html?redirectTo=${request.url}`)
    }
    next()
  }
}
