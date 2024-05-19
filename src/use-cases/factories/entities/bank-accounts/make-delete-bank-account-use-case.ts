import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'
import { DeleteBankAccountUseCase } from '@/use-cases/entities/bank-accounts/delete-bank-account'

export function makeDeleteBankAccountUseCase() {
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const useCase = new DeleteBankAccountUseCase(bankAccountsRepository)

  return useCase
}
