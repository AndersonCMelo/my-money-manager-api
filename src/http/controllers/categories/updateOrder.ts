import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateCategoryOrderUseCase } from '@/use-cases/factories/entities/categories/make-update-category-order-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function updateOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    order: z.string(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  const { order } = updateBodySchema.parse(request.body)

  try {
    const useCase = makeUpdateCategoryOrderUseCase()

    await useCase.execute({
      id,
      order,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
