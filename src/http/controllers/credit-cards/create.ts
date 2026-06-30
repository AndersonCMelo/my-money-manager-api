import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateCreditCardUseCase } from '@/use-cases/factories/entities/credit-cards/make-create-credit-card-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    limit: z.number(),
    closingDay: z.number().int().min(1).max(31),
    dueDay: z.number().int().min(1).max(31),
    color: z.string().nullable().optional(),
    ownerId: z.string(),
  })

  const { name, limit, closingDay, dueDay, color, ownerId } = bodySchema.parse(
    request.body,
  )

  try {
    const useCase = makeCreateCreditCardUseCase()

    const response = await useCase.execute({
      name,
      limit,
      closingDay,
      dueDay,
      color,
      ownerId,
    })

    return reply.status(201).send(response)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
