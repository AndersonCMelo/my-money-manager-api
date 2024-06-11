import { makeGetAmountPerAccountUseCase } from '@/use-cases/factories/entities/metrics/make-get-amount-per-account-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function amountPerAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    month: z.string(),
  })

  const { month } = fetchParamsSchema.parse(request.params)

  const useCase = makeGetAmountPerAccountUseCase()

  const response = await useCase.execute({ month })

  return reply.status(200).send(response)
}
