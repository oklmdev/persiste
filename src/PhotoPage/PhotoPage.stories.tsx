import * as React from 'react'
import { PhotoPage } from './PhotoPage'

export default { title: "Page d'upload de photo", component: PhotoPage }

export const BeforeUpload = () => <PhotoPage />

export const AfterUpload = () => (
  <PhotoPage uploadedPhoto='https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1000&h=756&q=80' />
)
