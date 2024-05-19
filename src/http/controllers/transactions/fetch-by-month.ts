import { makeFetchTransactionsByMonthUseCase } from '@/use-cases/factories/entities/transactions/make-fetch-by-month-transactions-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function fetchByMonth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    month: z.string(),
  })

  const { month } = fetchParamsSchema.parse(request.params)

  const useCase = makeFetchTransactionsByMonthUseCase()

  const transactions = await useCase.execute({ month })

  return reply.status(200).send(transactions)
}
