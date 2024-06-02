import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryClassificationsRepository } from '@/repositories/in-memory/in-memory-classifications-repository'
import { DeleteClassificationUseCase } from './delete-classification'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let classificationsRepository: InMemoryClassificationsRepository
let sut: DeleteClassificationUseCase

describe('Delete Classification Use Case', () => {
  beforeEach(() => {
    classificationsRepository = new InMemoryClassificationsRepository()
    sut = new DeleteClassificationUseCase(classificationsRepository)
  })

  it('should be able to delete a classification', async () => {
    const createdClassification = await classificationsRepository.create({
      name: 'classification-01',
      color: '#00F0F0',
      order: 0,
    })

    await sut.execute({ classificationId: createdClassification.id })

    const classifications = await classificationsRepository.findMany()

    await expect(classifications).toEqual([])
  })

  it('should not be able to delete an inexistent classification', async () => {
    await expect(() =>
      sut.execute({ classificationId: 'classification-02' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
