import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetch } from './fetch'
import { update } from './update'

export async function settingsRoutes(app: FastifyInstance) {
  // app.addHook('onRequest', verifyJWT)
  app.post('/settings', create)

  app.get('/settings', { onRequest: [verifyJWT] }, fetch)
  app.put('/settings/:id', { onRequest: [verifyJWT] }, update)
}
