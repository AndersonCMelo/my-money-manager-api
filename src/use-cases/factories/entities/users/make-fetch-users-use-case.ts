import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FetchUsersUseCase } from '@/use-cases/entities/users/fetch-users'

export function makeFetchUsersUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new FetchUsersUseCase(usersRepository)

  return useCase
}
