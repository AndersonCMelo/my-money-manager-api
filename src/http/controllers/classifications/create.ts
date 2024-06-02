import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateClassificationUseCase } from '@/use-cases/factories/entities/classifications/make-create-classification-use-case'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    color: z.string(),
    order: z.number(),
  })

  const { name, color, order } = createBodySchema.parse(request.body)

  try {
    const createUseCase = makeCreateClassificationUseCase()

    const response = await createUseCase.execute({
      name,
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
