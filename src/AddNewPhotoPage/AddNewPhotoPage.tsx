import React from 'react'

type AddNewPhotoPageProps = {}

export const AddNewPhotoPage = ({}: AddNewPhotoPageProps) => {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-indigo-600'>Ready for OKLM ?</h2>
          <p className='mt-2 text-sm text-gray-600 flex justify-center items-center '>
            <LockClosedIcon />
            <span className=''>Your photo will remain private.</span>
          </p>
        </div>
        <form method='post' encType='multipart/form-data'>
          <div className='flex items-center justify-center'>
            <label
              htmlFor='image-upload'
              className='w-full sm:w-sm text-center relative cursor-pointer bg-white px-3 py-5 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'>
              <input id='image-upload' name='photo' type='file' accept='image/*' className='sr-only peer' required />
              <span className='peer-valid:hidden'>Choose an image file</span>
              <span className='text-green-700 hidden peer-valid:inline'>Image selected !</span>
            </label>
          </div>
          <div className='mt-6 flex justify-center'>
            <button
              type='submit'
              className='w-full sm:w-sm py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const LockClosedIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='w-6 h-6 inline-block'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
    />
  </svg>
)
