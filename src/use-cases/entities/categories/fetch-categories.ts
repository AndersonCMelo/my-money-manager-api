import { CategoriesRepository } from '@/repositories/categories-repository'

export class FetchCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute() {
    const categories = await this.categoriesRepository.findMany()

    return categories
  }
}
