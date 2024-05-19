import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetch } from './fetch'
import { deleteCategory } from './delete'
import { update } from './update'
import { updateOrder } from './updateOrder'

export async function categoriesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/categories', create)
  app.get('/categories', fetch)
  app.put('/categories/:id', update)
  app.patch('/categories/:id', updateOrder)
  app.delete('/categories/:id', deleteCategory)
}
