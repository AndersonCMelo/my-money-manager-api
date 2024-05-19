import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'
import { UpdateBankAccountBalanceUseCase } from '@/use-cases/entities/bank-accounts/update-bank-account-balance'

export function makeUpdateBankAccountBalanceUseCase() {
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const useCase = new UpdateBankAccountBalanceUseCase(bankAccountsRepository)

  return useCase
}
