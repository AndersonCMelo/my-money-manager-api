import { CategoriesRepository } from '@/repositories/categories-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface UpdateCategoryUseCaseRequest {
  id: string
  order: number
}

export class UpdateCategoryOrderUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async existentCategory(id: string) {
    await this.categoriesRepository.findById(id)
  }

  async execute({ id, order }: UpdateCategoryUseCaseRequest) {
    const existentCategory = await this.categoriesRepository.findById(id)

    if (!existentCategory) {
      throw new ResourceNotFoundError()
    }

    await this.categoriesRepository.updateOrder({
      id,
      order,
    })
  }
}
