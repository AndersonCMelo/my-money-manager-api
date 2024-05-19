import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateBankAccountUseCase } from '@/use-cases/entities/bank-accounts/update-bank-account'

export function makeUpdateBankAccountUseCase() {
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new UpdateBankAccountUseCase(
    bankAccountsRepository,
    usersRepository,
  )

  return useCase
}
