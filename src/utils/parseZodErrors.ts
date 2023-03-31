import { ZodError } from 'zod'

export const parseZodErrors = (error: ZodError) => {
  return error.issues.reduce((errorMap, { message, path }) => ({ ...errorMap, [path[0]]: message }), {})
}
