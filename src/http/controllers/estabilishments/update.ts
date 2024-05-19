import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateEstabilishmentUseCase } from '@/use-cases/factories/entities/estabilishments/make-update-estabilishment-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    estabilishment: z.string(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  const { estabilishment } = updateBodySchema.parse(request.body)

  try {
    const useCase = makeUpdateEstabilishmentUseCase()

    const response = await useCase.execute({
      id,
      estabilishment,
    })

    return reply.status(200).send(response.estabilishment)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
