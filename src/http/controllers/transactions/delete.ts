import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteTransactionUseCase } from '@/use-cases/factories/entities/transactions/make-delete-transaction-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function deleteTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  try {
    const useCase = makeDeleteTransactionUseCase()

    await useCase.execute({ id })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
