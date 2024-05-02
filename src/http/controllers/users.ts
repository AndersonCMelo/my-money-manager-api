import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUsersUseCase } from '@/use-cases/get-users'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const usersRepository = new PrismaUsersRepository()
    const getUsersUseCase = new GetUsersUseCase(usersRepository)

    const users = await getUsersUseCase.execute()

    return reply.status(200).send(users)
  } catch (error) {
    console.error(error)
  }
}
