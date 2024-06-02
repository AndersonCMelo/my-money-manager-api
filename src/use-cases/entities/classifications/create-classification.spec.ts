import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryClassificationsRepository } from '@/repositories/in-memory/in-memory-classifications-repository'
import { CreateClassificationUseCase } from './create-classification'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'
import { CategoryOrderAlreadyExistsError } from '@/use-cases/errors/category-order-already-exists-error'

let classificationsRepository: InMemoryClassificationsRepository
let sut: CreateClassificationUseCase

describe('Create Classification Use Case', () => {
  beforeEach(() => {
    classificationsRepository = new InMemoryClassificationsRepository()
    sut = new CreateClassificationUseCase(classificationsRepository)
  })

  it('should be able to create classification', async () => {
    const { classification } = await sut.execute({
      name: 'classification-01',
      color: '#00F0F0',
      order: 0,
    })

    expect(classification.id).toEqual(expect.any(String))
  })

  it('should not be able to create a new classification with the same classification name', async () => {
    const classificationName = 'classification-01'

    await sut.execute({
      name: classificationName,
      color: '#00F0F0',
      order: 0,
    })

    await expect(() =>
      sut.execute({
        name: classificationName,
        color: '#0000FF',
        order: 1,
      }),
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it('should not be able to create a new classification with the same order', async () => {
    const classificationOrder = 0

    await sut.execute({
      name: 'classification-01',
      color: '#00F0F0',
      order: classificationOrder,
    })

    await expect(() =>
      sut.execute({
        name: 'classification-02',
        color: '#0000FF',
        order: classificationOrder,
      }),
    ).rejects.toBeInstanceOf(CategoryOrderAlreadyExistsError)
  })
})
