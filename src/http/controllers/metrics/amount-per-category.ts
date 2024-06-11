import { makeGetAmountPerCategoryUseCase } from '@/use-cases/factories/entities/metrics/make-get-amount-per-category-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function amountPerCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    month: z.string(),
  })

  const { month } = fetchParamsSchema.parse(request.params)

  const useCase = makeGetAmountPerCategoryUseCase()

  const response = await useCase.execute({ month })

  return reply.status(200).send(response)
}
