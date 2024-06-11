import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { monthlyPercentage } from './monthly-percentage'
import { amountPerCategory } from './amount-per-category'
import { amountPerAccount } from './amount-per-account'

export async function metricsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/metrics/monthly-percentage/:month', monthlyPercentage)
  app.get('/metrics/amount-per-category/:month', amountPerCategory)
  app.get('/metrics/amount-per-account/:month', amountPerAccount)
}
