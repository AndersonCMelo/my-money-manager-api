import { makeFetchUsersUseCase } from '@/use-cases/factories/entities/users/make-fetch-users-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeFetchUsersUseCase()

  const users = await useCase.execute()

  return reply.status(200).send(users)
}
