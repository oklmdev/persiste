import express from 'express'

import { requireAuth } from '../auth/requireAuth'
import { AddNewPhotoPage } from './AddNewPhotoPage'
import { responseAsHtml } from '../utils/responseAsHtml'

export const addNewPhotoRouter = express.Router()

addNewPhotoRouter.route('/addNewPhoto.html').get(requireAuth(), async (_, response) => {
  return responseAsHtml(AddNewPhotoPage({}), { response })
})
