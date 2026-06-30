import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateCreditCardUseCase } from '@/use-cases/factories/entities/credit-cards/make-update-credit-card-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string() })
  const bodySchema = z.object({
    name: z.string(),
    limit: z.number(),
    closingDay: z.number().int().min(1).max(31),
    dueDay: z.number().int().min(1).max(31),
    color: z.string().nullable().optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const { name, limit, closingDay, dueDay, color } = bodySchema.parse(
    request.body,
  )

  try {
    const useCase = makeUpdateCreditCardUseCase()

    const response = await useCase.execute({
      id,
      name,
      limit,
      closingDay,
      dueDay,
      color,
    })

    return reply.status(200).send(response)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
