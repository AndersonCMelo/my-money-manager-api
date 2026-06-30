import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchCreditCardsUseCase } from '@/use-cases/factories/entities/credit-cards/make-fetch-credit-cards-use-case'

export async function fetch(_request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeFetchCreditCardsUseCase()
  const response = await useCase.execute()

  return reply.status(200).send(response)
}
