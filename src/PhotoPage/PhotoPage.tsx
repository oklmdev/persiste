import React from 'react'

type PhotoPageProps = {
  imageUrl: string
}

export const PhotoPage = ({ imageUrl }: PhotoPageProps) => {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-indigo-600'>Your Uploaded Image</h2>
        </div>
        <div className='flex items-center justify-center'>
          <img src={imageUrl} alt='Uploaded image' className='object-contain max-h-96 w-full' />
        </div>
      </div>
    </div>
  )
}
