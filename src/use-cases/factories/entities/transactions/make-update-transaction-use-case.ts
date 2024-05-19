import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { UpdateTransactionUseCase } from '@/use-cases/entities/transactions/update-transaction'
import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository'

export function makeUpdateTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const useCase = new UpdateTransactionUseCase(
    transactionsRepository,
    categoriesRepository,
  )

  return useCase
}
