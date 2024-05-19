import { makeFetchEstabilishmentUseCase } from '@/use-cases/factories/entities/estabilishments/make-fetch-estabilishments-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeFetchEstabilishmentUseCase()

  const estabilishments = await useCase.execute()

  return reply.status(200).send(estabilishments)
}
