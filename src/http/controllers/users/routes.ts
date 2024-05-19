import { FastifyInstance } from 'fastify'
import { register } from './register'
import { fetch } from './fetch'
import { get } from './get'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/login', authenticate)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.get('/users', { onRequest: [verifyJWT] }, fetch)
  app.get('/users/:id', { onRequest: [verifyJWT] }, get)
}
