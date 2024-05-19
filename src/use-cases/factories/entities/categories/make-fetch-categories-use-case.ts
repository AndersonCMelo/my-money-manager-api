import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository'
import { FetchCategoriesUseCase } from '@/use-cases/entities/categories/fetch-categories'

export function makeFetchCategoryUseCase() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const useCase = new FetchCategoriesUseCase(categoriesRepository)

  return useCase
}
