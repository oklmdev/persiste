import express from 'express'
import { requireAuth } from '../auth/requireAuth'
import { responseAsHtml } from '../utils/responseAsHtml'
import { HelloWorldPage } from './HelloWorld'

export const helloWorldRouter = express.Router()

helloWorldRouter.route('/').get(
  requireAuth(async (_, response) => {
    return responseAsHtml(HelloWorldPage(), { response })
  })
)
