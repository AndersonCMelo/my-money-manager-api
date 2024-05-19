import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetch } from './fetch'
import { deleteTransaction } from './delete'
import { update } from './update'
import { fetchByMonth } from './fetch-by-month'

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/transactions', create)
  app.get('/transactions', fetch)
  app.get('/transactions/:month', fetchByMonth)
  app.put('/transactions/:id', update)
  app.delete('/transactions/:id', deleteTransaction)
}
