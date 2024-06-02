import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { monthlyPercentage } from './monthly-percentage'

export async function metricsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/metrics/monthly-percentage/:month', monthlyPercentage)
}
