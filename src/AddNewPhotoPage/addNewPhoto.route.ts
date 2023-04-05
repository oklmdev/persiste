import express from 'express'
import multer from 'multer'
import fs from 'node:fs'

import { requireAuth } from '../auth/requireAuth'
import { AddNewPhotoPage } from './AddNewPhotoPage'
import { responseAsHtml } from '../utils/responseAsHtml'
import { uploadPhoto } from '../utils/photoStorage'
import { getUuid } from '../utils/getUuid'

const MB = 1024 * 1024
const upload = multer({
  dest: 'temp/photos',
  limits: { fileSize: 50 * MB },
})

export const addNewPhotoRouter = express.Router()

addNewPhotoRouter
  .route('/addNewPhoto.html')
  .get(requireAuth(), async (_, response) => {
    return responseAsHtml(AddNewPhotoPage({}), { response })
  })
  .post(requireAuth(), upload.single('photo'), async (request, response) => {
    console.log('POST on addNewPhoto.html')
    const { file } = request
    const photoId = getUuid()
    if (file) {
      console.log('Got file')
      await uploadPhoto({ contents: fs.createReadStream(file.path), id: photoId })
    } else {
      console.log('no file')
    }

    return response.send('Success !')
  })
