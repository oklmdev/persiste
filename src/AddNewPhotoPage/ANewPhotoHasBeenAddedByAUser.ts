import { Fact, makeFact } from '../utils/addToHistory'

export type ANewPhotoHasBeenAddedByAUser = Fact<
  'ANewPhotoHasBeenAddedByAUser',
  {
    photoId: string
    location:
      | {
          type: 'S3'
          bucket: string
          endpoint: string
          key: string
        }
      | { type: 'localfile' }
    addedBy: string
  }
>

export const ANewPhotoHasBeenAddedByAUser = makeFact<ANewPhotoHasBeenAddedByAUser>('ANewPhotoHasBeenAddedByAUser')
