import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteCreditCardUseCase } from '@/use-cases/factories/entities/credit-cards/make-delete-credit-card-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function deleteCreditCard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({ id: z.string() })
  const { id } = paramsSchema.parse(request.params)

  try {
    const useCase = makeDeleteCreditCardUseCase()
    await useCase.execute({ id })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
