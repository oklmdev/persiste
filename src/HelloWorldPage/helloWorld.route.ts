import express from 'express'
import { isUserAuthenticated } from '../auth/isUserAuthenticated'
import { responseAsHtml } from '../utils/responseAsHtml'
import { HelloWorldPage } from './HelloWorld'

export const helloWorldRouter = express.Router()

helloWorldRouter.route('/').get(async (request, response) => {
  if (!isUserAuthenticated(request, response)) return

  return responseAsHtml(HelloWorldPage(), { response })
})
