import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateEstabilishmentUseCase } from '@/use-cases/factories/entities/estabilishments/make-create-estabilishment-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    estabilishment: z.string(),
  })

  const { estabilishment } = createBodySchema.parse(request.body)

  const createUseCase = makeCreateEstabilishmentUseCase()

  const response = await createUseCase.execute({
    estabilishment,
  })

  return reply.status(201).send(response)
}
