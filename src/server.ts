import express, { Express } from 'express'
require('express-async-errors')
import session from 'express-session'
import path from 'node:path'
import { SESSION_SECRET, PORT } from './env'
import connectPgSimple from 'connect-pg-simple'
import { postgres } from './postgres'

const pgSession = connectPgSimple(session)

const sessionStore = new pgSession({
  pool: postgres,
  createTableIfMissing: true,
  tableName: 'user_sessions',
})

const app: Express = express()

app.use(
  express.urlencoded({
    extended: false,
    limit: '10mb',
  })
)
app.use(express.json({ limit: '10mb' }))

app.get('/ping', (_: express.Request, response: express.Response): void => {
  response.send('pong')
})

app.use(
  session({
    secret: SESSION_SECRET,
    store: sessionStore,
    resave: false,
    proxy: true,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
)

app.use(express.static(path.join(__dirname, 'assets')))

const port = parseInt(PORT ?? '3000')
app.listen(port, (): void => {
  // eslint-disable-next-line no-console
  console.log('Server listening to port', port)
})
