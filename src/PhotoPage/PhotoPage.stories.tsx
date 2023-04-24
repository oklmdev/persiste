import React from 'react'
import { PhotoPage } from './PhotoPage'

export default { title: 'PhotoPage', component: PhotoPage }

export const primary = () => (
  <PhotoPage imageUrl='https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=500&h=500&q=80' />
)
