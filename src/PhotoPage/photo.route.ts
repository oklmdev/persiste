import express from 'express'
import z from 'zod'

import { ANewPhotoHasBeenAddedByAUser } from '../AddNewPhotoPage/ANewPhotoHasBeenAddedByAUser'
import { requireAuth } from '../auth/requireAuth'
import { postgres } from '../postgres'
import { downloadPhoto } from '../utils/photoStorage'
import { responseAsHtml } from '../utils/responseAsHtml'
import { PhotoPage } from './PhotoPage'

export const photoRouter = express.Router()

photoRouter.route('/photo/:photoId/page.html').get(
  requireAuth(async (request, response) => {
    const { photoId } = z
      .object({
        photoId: z.string().uuid(),
      })
      .parse(request.params)

    const { rowCount } = await postgres.query<ANewPhotoHasBeenAddedByAUser>(
      `SELECT * FROM history WHERE type='ANewPhotoHasBeenAddedByAUser' AND details->>'photoId'=$1 LIMIT 1`,
      [photoId]
    )

    if (rowCount === 0) return response.send('Nope')

    return responseAsHtml(PhotoPage({ imageUrl: `/photo/${photoId}/photo.jpg` }), { response })
  })
)

photoRouter.route('/photo/:photoId/photo.jpg').get(
  requireAuth(async (request, response) => {
    const { photoId } = z
      .object({
        photoId: z.string().uuid(),
      })
      .parse(request.params)

    const { rowCount } = await postgres.query<ANewPhotoHasBeenAddedByAUser>(
      `SELECT * FROM history WHERE type='ANewPhotoHasBeenAddedByAUser' AND details->>'photoId'=$1 LIMIT 1`,
      [photoId]
    )

    if (rowCount === 0) return response.send('Nope')

    response.set('Content-Type', 'image/*')
    return downloadPhoto(photoId).pipe(response)
  })
)
