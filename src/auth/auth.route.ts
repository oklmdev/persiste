import bcrypt from 'bcryptjs'
import express from 'express'
import z, { ZodError } from 'zod'
import { PASSWORD_SALT, REGISTRATION_CODE } from '../env'
import { postgres } from '../postgres'
import { getUuid } from '../utils/getUuid'
import { responseAsHtml } from '../utils/responseAsHtml'
import { ConnectionPage } from './ConnectionPage'
import { parseZodErrors } from '../utils/parseZodErrors'

export const authRouter = express.Router()

authRouter
  .route('/login.html')
  .get(async (request, response) => {
    const { redirectTo, code } = z
      .object({
        code: z.string().optional(),
        redirectTo: z.string().optional(),
      })
      .parse(request.query)

    return responseAsHtml(ConnectionPage({ redirectTo, code }), { response })
  })
  .post(async (request, response) => {
    try {
      const { loginType, email, password, redirectTo, code } = z
        .object({
          loginType: z.enum(['login', 'register']),
          email: z.string().email(),
          password: z.string().min(8),
          redirectTo: z.string().optional(),
          code: z.string().optional(),
        })
        .parse(request.body)

      // Registration case
      if (loginType === 'register') {
        if (REGISTRATION_CODE && code !== REGISTRATION_CODE) {
          return responseAsHtml(
            ConnectionPage({
              errors: {
                other: "Désolé mais les inscriptions sont fermées pour le moment. Merci de revenir avec un lien d'invitation.",
              },
              loginType,
              email,
              redirectTo,
            }),
            { response }
          )
        }

        const userId = await register(email, password)

        request.session.user = { id: userId, name: email }
        return response.redirect(redirectTo || '/')
      }

      // Login case
      const userId = await login(email, password)
      request.session.user = { id: userId, name: email }

      response.redirect(redirectTo || '/')
    } catch (error) {
      const { loginType, email, redirectTo, code } = request.body
      console.error(error)
      return responseAsHtml(
        ConnectionPage({
          errors:
            error instanceof ZodError
              ? parseZodErrors(error)
              : { other: error instanceof Error ? error.message : 'Erreur inconnue' },
          loginType,
          email,
          redirectTo,
          code,
        }),
        { response }
      )
    }
  })

authRouter.all('/logout', async (request, response) => {
  if (request.session) {
    request.session.destroy((error) => {
      if (error) {
        response.status(400).send('Impossible de se déconnecter')
      } else {
        response.redirect('/')
      }
    })
  } else {
    response.redirect('/')
  }
})

async function login(email: string, password: string): Promise<string> {
  const { rows } = await postgres.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [email])

  if (!rows.length) {
    throw new Error('Email unknown')
  }

  const isCorrectPassword = await bcrypt.compare(password, rows[0].password_hash)

  if (!isCorrectPassword) {
    throw new Error('Wrong password')
  }

  return rows[0].id
}

async function register(email: string, password: string) {
  const { rowCount } = await postgres.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [email])

  if (rowCount) {
    throw new Error('Email already taken')
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT)

  const userId = getUuid()

  await postgres.query('INSERT INTO users (id, email, password_hash, registered_at) VALUES ($1, $2, $3, NOW())', [
    userId,
    email,
    passwordHash,
  ])

  return userId
}
