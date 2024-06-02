import fastify from 'fastify'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'
import { settingsRoutes } from './http/controllers/settings/routes'
import { categoriesRoutes } from './http/controllers/categories/routes'
import { estabilishmentsRoutes } from './http/controllers/estabilishments/routes'
import { bankAccoutnsRoutes } from './http/controllers/bank-accounts/routes'
import { transactionsRoutes } from './http/controllers/transactions/routes'
import { metricsRoutes } from './http/controllers/metrics/routes'

import cors from '@fastify/cors'

export const app = fastify()

app.register(cors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(settingsRoutes)
app.register(categoriesRoutes)
app.register(estabilishmentsRoutes)
app.register(bankAccoutnsRoutes)
app.register(transactionsRoutes)
app.register(metricsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: error.message })
})
