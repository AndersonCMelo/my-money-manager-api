import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryClassificationsRepository } from '@/repositories/in-memory/in-memory-classifications-repository'
import { UpdateClassificationUseCase } from './update-classification'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'

let classificationsRepository: InMemoryClassificationsRepository
let sut: UpdateClassificationUseCase

describe('Update Settings Use Case', () => {
  beforeEach(() => {
    classificationsRepository = new InMemoryClassificationsRepository()
    sut = new UpdateClassificationUseCase(classificationsRepository)
  })

  it('should be able to update a classification', async () => {
    const classification = await classificationsRepository.create({
      name: 'classification-01',
      color: '#00F0F0',
      order: 0,
    })

    await sut.execute({
      id: classification.id,
      name: 'classification-01-edited',
      color: '#00F0F0',
    })

    expect(classification).toEqual(
      expect.objectContaining({ name: 'classification-01-edited' }),
    )
  })

  it('should not be able to update a classification with the same name of a existent classification', async () => {
    await classificationsRepository.create({
      name: 'classification-01',
      color: '#00F0F0',
      order: 0,
    })

    const classification = await classificationsRepository.create({
      name: 'classification-02',
      color: '#00FF00',
      order: 1,
    })

    await expect(() =>
      sut.execute({
        id: classification.id,
        name: 'classification-01',
        color: '#00FF00',
      }),
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it('should not be able to update an inexistent classification', async () => {
    await expect(() =>
      sut.execute({
        id: 'classification-01',
        name: 'classification-01',
        color: '#00F0F0',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
