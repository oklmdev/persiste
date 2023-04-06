import aws from 'aws-sdk'
import fs from 'node:fs'
import path from 'node:path'
import { PHOTO_ACCESS_KEY_ID, PHOTO_SECRET_ACCESS_KEY, PHOTO_ENDPOINT, PHOTO_BUCKET, PHOTO_STORAGE } from '../env'

type UUID = string
let downloadPhoto: (photoId: UUID) => NodeJS.ReadableStream = downloadPhotoLocally
let uploadPhoto: (args: UploadPhotoArgs) => Promise<unknown> = uploadPhotoLocally

if (PHOTO_STORAGE === 'S3') {
  const credentials = new aws.Credentials(PHOTO_ACCESS_KEY_ID, PHOTO_SECRET_ACCESS_KEY)

  const s3client = new aws.S3({ credentials, endpoint: PHOTO_ENDPOINT })

  downloadPhoto = (photoId: UUID) => {
    return s3client.getObject({ Bucket: PHOTO_BUCKET, Key: photoId }).createReadStream()
  }

  uploadPhoto = async ({ contents, id }: UploadPhotoArgs) => {
    await s3client.upload({ Bucket: PHOTO_BUCKET, Key: id, Body: contents }).promise()
  }
}

export { downloadPhoto, uploadPhoto }

const localFilePath = (photoId: UUID) => path.join(__dirname, '../../temp/photos', photoId)

function downloadPhotoLocally(photoId: UUID) {
  return fs.createReadStream(localFilePath(photoId))
}

type UploadPhotoArgs = {
  contents: NodeJS.ReadableStream
  id: UUID
}
async function uploadPhotoLocally({ contents, id }: UploadPhotoArgs) {
  const filePath = localFilePath(id)
  return new Promise((resolve, reject) => {
    const uploadWriteStream = fs.createWriteStream(filePath, {
      autoClose: true,
    })
    uploadWriteStream.on('error', reject)
    uploadWriteStream.on('close', resolve)
    contents.pipe(uploadWriteStream)
  })
}
