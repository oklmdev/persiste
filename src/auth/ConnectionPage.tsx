import * as React from 'react'
import c from 'classnames'

type ConnectionPageProps = {
  loginType?: 'login' | 'register'
  email?: string
  redirectTo?: string
  code?: string
  errors?: { password?: string; email?: string; other?: string }
}
export const ConnectionPage = ({ loginType = 'login', email, redirectTo, code, errors }: ConnectionPageProps) => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Identifiez-vous</h2>
        <p className='mt-2 text-center text-sm text-gray-600 max-w'>pour accèder à votre espace Photos</p>
      </div>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form method='post' aria-describedby={errors ? 'form-error-message' : undefined} className='space-y-6'>
            <input type='hidden' name='redirectTo' value={redirectTo ?? undefined} />
            <input type='hidden' name='code' value={code ?? undefined} />
            <fieldset className='mt-4'>
              <legend className='sr-only'>Login or Register</legend>
              <div className='space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='loginType'
                    value='login'
                    defaultChecked={loginType === 'login'}
                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                  />
                  <label htmlFor='loginType' className='ml-3 block text-sm font-medium text-gray-700'>
                    Compte existant
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='loginType'
                    value='register'
                    defaultChecked={loginType === 'register'}
                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                  />
                  <label htmlFor='loginType' className='ml-3 block text-sm font-medium text-gray-700'>
                    Nouveau compte
                  </label>
                </div>
              </div>
            </fieldset>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Adresse email
              </label>
              <div className='mt-1 relative'>
                <input
                  type='text'
                  id='email-input'
                  name='email'
                  autoComplete='email'
                  autoFocus
                  defaultValue={email}
                  aria-invalid={Boolean(errors?.email)}
                  aria-describedby={errors?.email ? 'email-error' : undefined}
                  required
                  className={c(
                    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    {
                      'border-red-300': !!errors?.email,
                    }
                  )}
                />
                {errors?.email ? (
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                    {/* Heroicon name: exclamation-circle */}
                    <svg
                      className='h-5 w-5 text-red-500'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Mot de passe
              </label>
              <div className='mt-1 relative'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className={c(
                    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    {
                      'border-red-300': !!errors?.password,
                    }
                  )}
                  aria-invalid={Boolean(errors?.password) || undefined}
                  aria-describedby={errors?.password ? 'password-error' : undefined}
                />
                {errors?.password ? (
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                    {/* Heroicon name: exclamation-circle */}
                    <svg
                      className='h-5 w-5 text-red-500'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            {errors ? (
              <div className='rounded-md bg-red-50 p-4'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
                  </div>
                  <div className='ml-3'>
                    {/* <h3 className="text-sm font-medium text-red-800">There were 2 errors with your submission</h3> */}
                    <div className='text-sm text-red-700'>
                      {Object.values(errors).map((errorMsg, index) => (
                        <div key={`error_${index}`}>{errorMsg}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const XCircleIcon = (props: { className?: string }) => {
  return (
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
        d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
  )
}
