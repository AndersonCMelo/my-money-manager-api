import { CategoriesRepository } from '@/repositories/categories-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface DeleteCategoryUseCaseRequest {
  categoryId: string
}

export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ categoryId }: DeleteCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new ResourceNotFoundError()
    }

    await this.categoriesRepository.delete(categoryId)
  }
}
