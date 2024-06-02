import { expect, describe, it, beforeEach } from 'vitest'
import { FetchClassificationsUseCase } from './fetch-classifications'
import { InMemoryClassificationsRepository } from '@/repositories/in-memory/in-memory-classifications-repository'

let classificationsRepository: InMemoryClassificationsRepository
let sut: FetchClassificationsUseCase

describe('Fetch Classifications Use Case', () => {
  beforeEach(() => {
    classificationsRepository = new InMemoryClassificationsRepository()
    sut = new FetchClassificationsUseCase(classificationsRepository)
  })

  it('should be able to get users', async () => {
    await classificationsRepository.create({
      name: 'classification-01',
      color: '#00F0F0',
      order: 0,
    })

    await classificationsRepository.create({
      name: 'classification-02',
      color: '#0000FF',
      order: 1,
    })

    const classifications = await sut.execute()

    expect(classifications).toEqual([
      expect.objectContaining({ name: 'classification-01' }),
      expect.objectContaining({ name: 'classification-02' }),
    ])
  })
})
