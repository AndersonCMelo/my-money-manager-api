import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryClassificationsRepository } from '@/repositories/in-memory/in-memory-classifications-repository'
import { UpdateClassificationOrderUseCase } from './update-classification-order'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let classificationsRepository: InMemoryClassificationsRepository
let sut: UpdateClassificationOrderUseCase

describe('Update Settings Use Case', () => {
  beforeEach(() => {
    classificationsRepository = new InMemoryClassificationsRepository()
    sut = new UpdateClassificationOrderUseCase(classificationsRepository)
  })

  it('should be able to update a classification order', async () => {
    const classification1 = await classificationsRepository.create({
      name: 'classification-01',
      color: '#00F0F0',
      order: 0,
    })
    const classification2 = await classificationsRepository.create({
      name: 'classification-02',
      color: '#00FF00',
      order: 1,
    })

    await sut.execute({
      id: classification1.id,
      order: 1,
    })

    await sut.execute({
      id: classification2.id,
      order: 0,
    })

    const classifications = await classificationsRepository.findMany()

    expect(classifications).toEqual([
      expect.objectContaining({ id: classification1.id, order: 1 }),
      expect.objectContaining({ id: classification2.id, order: 0 }),
    ])
  })

  it('should not be able to update an inexistent classification', async () => {
    await expect(() =>
      sut.execute({
        id: 'inexistent_id',
        order: 0,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
