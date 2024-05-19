import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateTransactionUseCase } from '@/use-cases/factories/entities/transactions/make-update-transaction-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  /* enum TransactionType {
    Income = 'income',
    Expense = 'expense',
    Transfer = 'transfer',
  } */

  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    description: z.string().nullable(),
    // amount: z.number(),
    estabilishment: z.string().nullable(),
    /* type: z.enum([
      TransactionType.Income,
      TransactionType.Expense,
      TransactionType.Transfer,
    ]), */
    essencial: z.boolean(),
    date: z.string(),
    categoryId: z.string(),
    // bankAccountId: z.string(),
    // destinationBankAccountId: z.string().nullable(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  const { description, estabilishment, essencial, date, categoryId } =
    updateBodySchema.parse(request.body)

  try {
    const useCase = makeUpdateTransactionUseCase()

    const response = await useCase.execute({
      id,
      description,
      estabilishment,
      essencial,
      date,
      categoryId,
    })

    return reply.status(200).send(response.transactions)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof Error && error.message === 'Category not found.') {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof Error && error.message === 'Bank account not found.') {
      return reply.status(409).send({ message: error.message })
    }
    if (
      error instanceof Error &&
      error.message === 'You need to provide a destination account.'
    ) {
      return reply.status(409).send({ message: error.message })
    }
    if (
      error instanceof Error &&
      error.message === 'Destination bank account not found.'
    ) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
