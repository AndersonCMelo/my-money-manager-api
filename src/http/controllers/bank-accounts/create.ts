import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateBankAccountUseCase } from '@/use-cases/factories/entities/bank-accounts/make-create-bank-account-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    bankName: z.string(),
    accountLabel: z.string().nullable(),
    openingBalance: z.number(),
    accountBalance: z.number().nullable(),
    type: z.string().nullable(),
    ownerId: z.string(),
  })

  const {
    accountBalance,
    accountLabel,
    bankName,
    openingBalance,
    ownerId,
    type,
  } = createBodySchema.parse(request.body)

  try {
    const createUseCase = makeCreateBankAccountUseCase()

    const response = await createUseCase.execute({
      accountBalance,
      accountLabel,
      bankName,
      openingBalance,
      ownerId,
      type,
    })

    return reply.status(201).send(response)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
