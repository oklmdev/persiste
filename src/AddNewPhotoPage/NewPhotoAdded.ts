import { Fact, makeFact } from '../utils/addToHistory'

export type NewPhotoAdded = Fact<
  'NewPhotoAdded',
  {
    photoId: string
    addedBy: string
  }
>

export const NewPhotoAdded = makeFact<NewPhotoAdded>('NewPhotoAdded')
