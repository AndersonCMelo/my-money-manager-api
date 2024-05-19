import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'
import { FetchBankAccountsUseCase } from '@/use-cases/entities/bank-accounts/fetch-bank-accounts'

export function makeFetchBankAccountsUseCase() {
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const useCase = new FetchBankAccountsUseCase(bankAccountsRepository)

  return useCase
}
