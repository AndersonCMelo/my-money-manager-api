import { makeFetchClassificationUseCase } from '@/use-cases/factories/entities/classifications/make-fetch-classifications-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeFetchClassificationUseCase()

  const classifications = await useCase.execute()

  return reply.status(200).send(classifications)
}
