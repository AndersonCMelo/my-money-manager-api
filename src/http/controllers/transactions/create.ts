import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateTransactionUseCase } from '@/use-cases/factories/entities/transactions/make-create-transaction-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  enum TransactionType {
    Income = 'income',
    Expense = 'expense',
    Transfer = 'transfer',
  }

  const createBodySchema = z.object({
    description: z.string().nullable(),
    amount: z.number(),
    estabilishment: z.string().nullable(),
    type: z.enum([
      TransactionType.Income,
      TransactionType.Expense,
      TransactionType.Transfer,
    ]),
    essencial: z.boolean(),
    date: z.string(),
    categoryId: z.string(),
    bankAccountId: z.string(),
    destinationBankAccountId: z.string().nullable(),
  })

  const {
    description,
    amount,
    estabilishment,
    type,
    essencial,
    date,
    categoryId,
    bankAccountId,
    destinationBankAccountId,
  } = createBodySchema.parse(request.body)

  try {
    const createUseCase = makeCreateTransactionUseCase()

    const response = await createUseCase.execute({
      description,
      amount,
      estabilishment,
      type,
      essencial,
      date,
      categoryId,
      bankAccountId,
      destinationBankAccountId,
    })

    return reply.status(201).send(response)
  } catch (error) {
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
