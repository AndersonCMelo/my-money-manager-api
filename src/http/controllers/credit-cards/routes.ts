import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetch } from './fetch'
import { update } from './update'
import { deleteCreditCard } from './delete'

export async function creditCardsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/credit-cards', create)
  app.get('/credit-cards', fetch)
  app.put('/credit-cards/:id', update)
  app.delete('/credit-cards/:id', deleteCreditCard)
}
