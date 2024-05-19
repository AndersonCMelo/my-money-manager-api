import { makeFetchCategoryUseCase } from '@/use-cases/factories/entities/categories/make-fetch-categories-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeFetchCategoryUseCase()

  const categories = await useCase.execute()

  return reply.status(200).send(categories)
}
