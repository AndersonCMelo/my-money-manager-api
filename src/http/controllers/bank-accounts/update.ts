import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateBankAccountUseCase } from '@/use-cases/factories/entities/bank-accounts/make-update-bank-account-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    bankName: z.string(),
    accountLabel: z.string().nullable(),
    openingBalance: z.number(),
    accountBalance: z.number(),
    type: z.string().nullable(),
    ownerId: z.string(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  const {
    accountBalance,
    accountLabel,
    bankName,
    openingBalance,
    ownerId,
    type,
  } = updateBodySchema.parse(request.body)

  try {
    const useCase = makeUpdateBankAccountUseCase()

    const response = await useCase.execute({
      id,
      accountBalance,
      accountLabel,
      bankName,
      openingBalance,
      ownerId,
      type,
    })

    return reply.status(200).send(response.bankAccounts)
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
