import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { getUsers } from './controllers/users'

export async function appRoutes(app: FastifyInstance) {
  app.get('/users', getUsers)
  app.post('/users', register)
}
