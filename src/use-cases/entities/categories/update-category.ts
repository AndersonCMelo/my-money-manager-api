import { CategoriesRepository } from '@/repositories/categories-repository'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { Categories } from '@prisma/client'

interface UpdateCategoryUseCaseRequest {
  id: string
  category: string
  color: string
  // order: string
}

interface UpdateCategoryUseCaseResponse {
  category: Categories
}

export class UpdateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    id,
    category,
    color,
    // order,
  }: UpdateCategoryUseCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
    const existentCategory = await this.categoriesRepository.findById(id)

    if (!existentCategory) {
      throw new ResourceNotFoundError()
    }

    const categoryWithSameName =
      await this.categoriesRepository.findByCategoryName(category)

    if (categoryWithSameName && categoryWithSameName.id !== id) {
      throw new CategoryAlreadyExistsError()
    }

    const updatedCategory = await this.categoriesRepository.update({
      id,
      category,
      color,
    })

    return { category: updatedCategory }
  }
}
