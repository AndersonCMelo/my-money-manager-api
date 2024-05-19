import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { UpdateCategoryOrderUseCase } from './update-category-order'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let categoriesRepository: InMemoryCategoriesRepository
let sut: UpdateCategoryOrderUseCase

describe('Update Settings Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new UpdateCategoryOrderUseCase(categoriesRepository)
  })

  it('should be able to update a category order', async () => {
    const category1 = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })
    const category2 = await categoriesRepository.create({
      category: 'category-02',
      color: '#00FF00',
      order: 1,
    })

    await sut.execute({
      id: category1.id,
      order: 1,
    })

    await sut.execute({
      id: category2.id,
      order: 0,
    })

    const categories = await categoriesRepository.findMany()

    expect(categories).toEqual([
      expect.objectContaining({ id: category1.id, order: 1 }),
      expect.objectContaining({ id: category2.id, order: 0 }),
    ])
  })

  it('should not be able to update an inexistent category', async () => {
    await expect(() =>
      sut.execute({
        id: 'inexistent_id',
        order: 0,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
