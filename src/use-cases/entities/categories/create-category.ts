import { CategoriesRepository } from '@/repositories/categories-repository'
import { Categories } from '@prisma/client'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'
import { CategoryOrderAlreadyExistsError } from '@/use-cases/errors/category-order-already-exists-error'

interface CreateCategoryUseCaseRequest {
  category: string
  color: string
  order: string
}

interface CreateCategoryUseCaseResponse {
  category: Categories
}

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    category,
    color,
    order,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const categoryWithSameName =
      await this.categoriesRepository.findByCategoryName(category)

    if (categoryWithSameName) {
      throw new CategoryAlreadyExistsError()
    }

    const categoryWithSameOrder =
      await this.categoriesRepository.findByOrder(order)

    if (categoryWithSameOrder) {
      throw new CategoryOrderAlreadyExistsError()
    }

    const createdCategory = await this.categoriesRepository.create({
      category,
      color,
      order,
    })

    return { category: createdCategory }
  }
}
