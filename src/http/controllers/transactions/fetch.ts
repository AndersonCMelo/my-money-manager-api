import { makeFetchTransactionsUseCase } from '@/use-cases/factories/entities/transactions/make-fetch-transactions-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeFetchTransactionsUseCase()

  const transactions = await useCase.execute()

  return reply.status(200).send(transactions)
}
