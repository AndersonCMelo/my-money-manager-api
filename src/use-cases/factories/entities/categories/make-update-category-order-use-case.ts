import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository'
import { UpdateCategoryOrderUseCase } from '@/use-cases/entities/categories/update-category-order'

export function makeUpdateCategoryOrderUseCase() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const useCase = new UpdateCategoryOrderUseCase(categoriesRepository)

  return useCase
}
