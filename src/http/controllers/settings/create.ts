import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateSettingsUseCase } from '@/use-cases/factories/entities/settings/make-create-settings-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    currency: z.string(),
    language: z.string(),
  })

  const { currency, language } = createBodySchema.parse(request.body)

  const createUseCase = makeCreateSettingsUseCase()

  await createUseCase.execute({
    currency,
    language,
  })

  return reply.status(201).send()
}
