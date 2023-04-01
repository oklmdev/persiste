import * as React from 'react'

export const PhotoPage = (props: { uploadedPhoto?: string }) => {
  const { uploadedPhoto } = props
  return (
    <div className='bg-gray-800 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='lg:text-center'>
          <h2 className='text-base text-indigo-600 font-semibold tracking-wide uppercase'>Upload your photo</h2>
          <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'>
            Ready to show off your style?
          </p>
          <div className='mt-4 flex items-center max-w-2xl text-xl text-gray-400 lg:mx-auto'>
            <LockClosedIcon className='h-6 w-6 mr-2 text-green-500' aria-hidden='true' />
            <span>Your photo is kept private and secure</span>
          </div>
        </div>

        {uploadedPhoto ? (
          <div className='mt-10 flex justify-center'>
            <img src={uploadedPhoto} alt='Uploaded' className='w-full max-w-lg rounded-md' />
          </div>
        ) : (
          <div className='mt-10 sm:flex sm:justify-center'>
            <div className='sm:flex-shrink-0'>
              <div className='mt-3 sm:mt-0 sm:ml-3'>
                <label
                  htmlFor='photo'
                  className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10'
                >
                  Upload a photo
                </label>
                <input type='file' id='photo' className='sr-only' />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const LockClosedIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className={`w-6 h-6 ${props.className || ''}`}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
    />
  </svg>
)
