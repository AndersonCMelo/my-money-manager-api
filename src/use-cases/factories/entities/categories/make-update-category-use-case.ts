import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository'
import { UpdateCategoryUseCase } from '@/use-cases/entities/categories/update-category'

export function makeUpdateCategoryUseCase() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const useCase = new UpdateCategoryUseCase(categoriesRepository)

  return useCase
}
