import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'
import { GetAmountPerAccountUseCase } from '@/use-cases/entities/metrics/get-amount-per-account'

export function makeGetAmountPerAccountUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const useCase = new GetAmountPerAccountUseCase(
    transactionsRepository,
    bankAccountsRepository,
  )

  return useCase
}
