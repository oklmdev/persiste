import express from 'express'
import multer from 'multer'
import fs from 'node:fs'

import { requireAuth } from '../auth/requireAuth'
import { addToHistory } from '../utils/addToHistory'
import { getUuid } from '../utils/getUuid'
import { uploadPhoto } from '../utils/photoStorage'
import { responseAsHtml } from '../utils/responseAsHtml'
import { AddNewPhotoPage } from './AddNewPhotoPage'
import { NewPhotoAdded } from './NewPhotoAdded'

const MB = 1024 * 1024
const upload = multer({
  dest: 'temp/photos',
  limits: { fileSize: 50 * MB },
})

export const addNewPhotoRouter = express.Router()

addNewPhotoRouter
  .route('/addNewPhoto.html')
  .get(
    requireAuth(async (_, response) => {
      return responseAsHtml(AddNewPhotoPage({}), { response })
    })
  )
  .post(
    upload.single('photo'),
    requireAuth(async (request, response) => {
      console.log('POST on addNewPhoto.html')
      const { file } = request
      const photoId = getUuid()
      if (file) {
        await uploadPhoto({ contents: fs.createReadStream(file.path), id: photoId })
        await addToHistory(
          NewPhotoAdded({
            photoId,
            addedBy: request.session.user.id,
          })
        )
      } else {
        return response.send('Missing photo file ! Same player try again.')
      }

      return response.send('Success !')
    })
  )
