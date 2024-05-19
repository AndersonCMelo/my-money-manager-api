import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateCategoryUseCase } from '@/use-cases/factories/entities/categories/make-update-category-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    category: z.string(),
    color: z.string(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  const { category, color } = updateBodySchema.parse(request.body)

  try {
    const useCase = makeUpdateCategoryUseCase()

    const response = await useCase.execute({
      id,
      category,
      color,
    })

    return reply.status(200).send(response.category)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof CategoryAlreadyExistsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
