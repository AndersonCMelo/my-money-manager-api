import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetch } from './fetch'
import { deleteBankAccount } from './delete'
import { update } from './update'
import { updateBalance } from './update-balance'

export async function bankAccoutnsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/bank-accounts', create)
  app.get('/bank-accounts', fetch)
  app.put('/bank-accounts/:id', update)
  app.patch('/bank-accounts/:id', updateBalance)
  app.delete('/bank-accounts/:id', deleteBankAccount)
}
