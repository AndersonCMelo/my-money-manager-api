import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { DeleteCategoryUseCase } from './delete-category'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let categoriesRepository: InMemoryCategoriesRepository
let sut: DeleteCategoryUseCase

describe('Delete Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new DeleteCategoryUseCase(categoriesRepository)
  })

  it('should be able to delete a category', async () => {
    const createdCategory = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    await sut.execute({ categoryId: createdCategory.id })

    const categories = await categoriesRepository.findMany()

    await expect(categories).toEqual([])
  })

  it('should not be able to delete an inexistent category', async () => {
    await expect(() =>
      sut.execute({ categoryId: 'category-02' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
