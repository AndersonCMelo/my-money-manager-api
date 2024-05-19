import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { UpdateCategoryUseCase } from './update-category'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'

let categoriesRepository: InMemoryCategoriesRepository
let sut: UpdateCategoryUseCase

describe('Update Settings Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new UpdateCategoryUseCase(categoriesRepository)
  })

  it('should be able to update a category', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    await sut.execute({
      id: category.id,
      category: 'category-01-edited',
      color: '#00F0F0',
    })

    expect(category).toEqual(
      expect.objectContaining({ category: 'category-01-edited' }),
    )
  })

  it('should not be able to update a category with the same name of a existent category', async () => {
    await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const category = await categoriesRepository.create({
      category: 'category-02',
      color: '#00FF00',
      order: 1,
    })

    await expect(() =>
      sut.execute({
        id: category.id,
        category: 'category-01',
        color: '#00FF00',
      }),
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it('should not be able to update an inexistent category', async () => {
    await expect(() =>
      sut.execute({
        id: 'category-01',
        category: 'category-01',
        color: '#00F0F0',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
