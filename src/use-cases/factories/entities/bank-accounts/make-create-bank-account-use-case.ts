import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateBankAccountsUseCase } from '@/use-cases/entities/bank-accounts/create-bank-account'

export function makeCreateBankAccountUseCase() {
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CreateBankAccountsUseCase(
    bankAccountsRepository,
    usersRepository,
  )

  return useCase
}
