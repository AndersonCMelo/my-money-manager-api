import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateCategoryUseCase } from '@/use-cases/factories/entities/categories/make-create-category-use-case'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    category: z.string(),
    color: z.string(),
    order: z.number(),
  })

  const { category, color, order } = createBodySchema.parse(request.body)

  try {
    const createUseCase = makeCreateCategoryUseCase()

    const response = await createUseCase.execute({
      category,
      color,
      order,
    })

    return reply.status(201).send(response)
  } catch (error) {
    if (error instanceof CategoryAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
