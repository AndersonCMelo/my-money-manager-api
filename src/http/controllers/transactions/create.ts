import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateTransactionUseCase } from '@/use-cases/factories/entities/transactions/make-create-transaction-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    description: z.string().nullable(),
    amount: z.number().optional(),
    estabilishment: z.string().nullable(),
    type: z.enum(['income', 'expense', 'transfer', 'credit_expense', 'credit_payment']),
    essencial: z.boolean(),
    date: z.string(),
    categoryId: z.string(),
    bankAccountId: z.string().nullable(),
    destinationBankAccountId: z.string().nullable(),
    creditCardId: z.string().nullable().optional(),
    totalInstallments: z.number().int().min(1).nullable().optional(),
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
    creditCardId,
    totalInstallments,
  } = createBodySchema.parse(request.body)

  try {
    const createUseCase = makeCreateTransactionUseCase()

    const response = await createUseCase.execute({
      description,
      amount: amount ?? 0,
      estabilishment,
      type,
      essencial,
      date,
      categoryId,
      bankAccountId: bankAccountId ?? null,
      destinationBankAccountId,
      creditCardId: creditCardId ?? null,
      totalInstallments: totalInstallments ?? null,
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
    if (
      error instanceof Error &&
      [
        'Credit card is required for credit expenses.',
        'Credit card is required for credit payments.',
        'Credit card not found.',
        'No pending installments found for this bill.',
      ].includes(error.message)
    ) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
