import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateBankAccountBalanceUseCase } from '@/use-cases/factories/entities/bank-accounts/make-update-bank-account-balance-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'

export async function updateBalance(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    accountBalance: z.number(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  const { accountBalance } = updateBodySchema.parse(request.body)

  try {
    const useCase = makeUpdateBankAccountBalanceUseCase()

    const response = await useCase.execute({
      id,
      accountBalance,
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
