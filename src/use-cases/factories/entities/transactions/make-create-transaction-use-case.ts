import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { CreateTransactionUseCase } from '@/use-cases/entities/transactions/create-transaction'
import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository'
import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'

export function makeCreateTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const useCase = new CreateTransactionUseCase(
    transactionsRepository,
    categoriesRepository,
    bankAccountsRepository,
  )

  return useCase
}
