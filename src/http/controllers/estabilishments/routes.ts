import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetch } from './fetch'
import { deleteEstabilishment } from './delete'
import { update } from './update'

export async function estabilishmentsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/estabilishments', create)
  app.get('/estabilishments', fetch)
  app.patch('/estabilishments/:id', update)
  app.delete('/estabilishments/:id', deleteEstabilishment)
}
