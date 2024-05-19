import { expect, describe, it, beforeEach } from 'vitest'
import { FetchCategoriesUseCase } from './fetch-categories'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'

let categoriesRepository: InMemoryCategoriesRepository
let sut: FetchCategoriesUseCase

describe('Fetch Categories Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new FetchCategoriesUseCase(categoriesRepository)
  })

  it('should be able to get users', async () => {
    await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    await categoriesRepository.create({
      category: 'category-02',
      color: '#0000FF',
      order: 1,
    })

    const categories = await sut.execute()

    expect(categories).toEqual([
      expect.objectContaining({ category: 'category-01' }),
      expect.objectContaining({ category: 'category-02' }),
    ])
  })
})
