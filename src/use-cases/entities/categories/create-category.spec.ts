import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'
import { CategoryOrderAlreadyExistsError } from '@/use-cases/errors/category-order-already-exists-error'

let categoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('Create Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(categoriesRepository)
  })

  it('should be able to create category', async () => {
    const { category } = await sut.execute({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    expect(category.id).toEqual(expect.any(String))
  })

  it('should not be able to create a new category with the same category name', async () => {
    const categoryName = 'category-01'

    await sut.execute({
      category: categoryName,
      color: '#00F0F0',
      order: 0,
    })

    await expect(() =>
      sut.execute({
        category: categoryName,
        color: '#0000FF',
        order: 1,
      }),
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it('should not be able to create a new category with the same order', async () => {
    const categoryOrder = 0

    await sut.execute({
      category: 'category-01',
      color: '#00F0F0',
      order: categoryOrder,
    })

    await expect(() =>
      sut.execute({
        category: 'category-02',
        color: '#0000FF',
        order: categoryOrder,
      }),
    ).rejects.toBeInstanceOf(CategoryOrderAlreadyExistsError)
  })
})
