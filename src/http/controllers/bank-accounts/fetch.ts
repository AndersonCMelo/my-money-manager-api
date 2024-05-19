import { makeFetchBankAccountsUseCase } from '@/use-cases/factories/entities/bank-accounts/make-fetch-bank-accounts-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeFetchBankAccountsUseCase()

  const bankAccounts = await useCase.execute()

  return reply.status(200).send(bankAccounts)
}
