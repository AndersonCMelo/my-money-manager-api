import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateClassificationUseCase } from '@/use-cases/factories/entities/classifications/make-update-classification-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    name: z.string(),
    color: z.string(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  const { name, color } = updateBodySchema.parse(request.body)

  try {
    const useCase = makeUpdateClassificationUseCase()

    const response = await useCase.execute({
      id,
      name,
      color,
    })

    return reply.status(200).send(response.classification)
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
