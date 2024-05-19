import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateSettingsUseCase } from '@/use-cases/factories/entities/settings/make-update-settings-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    currency: z.string(),
    language: z.string(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  const { currency, language } = updateBodySchema.parse(request.body)

  try {
    const useCase = makeUpdateSettingsUseCase()

    const response = await useCase.execute({
      id,
      currency,
      language,
    })

    return reply.status(200).send(response.settings)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
