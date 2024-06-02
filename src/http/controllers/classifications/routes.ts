import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetch } from './fetch'
import { deleteClassification } from './delete'
import { update } from './update'
import { updateOrder } from './updateOrder'

export async function classificationsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/classifications', create)
  app.get('/classifications', fetch)
  app.put('/classifications/:id', update)
  app.patch('/classifications/:id', updateOrder)
  app.delete('/classifications/:id', deleteClassification)
}
