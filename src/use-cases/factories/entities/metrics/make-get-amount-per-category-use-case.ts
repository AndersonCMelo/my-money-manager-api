import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository'
import { GetAmountPerCategoryUseCase } from '@/use-cases/entities/metrics/get-amount-per-category'

export function makeGetAmountPerCategoryUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const useCase = new GetAmountPerCategoryUseCase(
    transactionsRepository,
    categoriesRepository,
  )

  return useCase
}
