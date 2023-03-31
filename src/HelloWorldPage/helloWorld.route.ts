import express from 'express'
import { requireAuth } from '../auth/requireAuth'
import { HelloWorldPage } from './HelloWorld'
import { responseAsHtml } from '../utils/responseAsHtml'

export const helloWorldRouter = express.Router()

helloWorldRouter.route('/').get(requireAuth(), async (_, response) => {
  return responseAsHtml(HelloWorldPage(), { response })
})
