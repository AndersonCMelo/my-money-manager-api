import { expect, describe, it, beforeEach } from 'vitest'
import { FetchEstabilishmentsUseCase } from './fetch-estabilishments'
import { InMemoryEstabilishmentsRepository } from '@/repositories/in-memory/in-memory-estabilishments-repository'

let estabilishmentsRepository: InMemoryEstabilishmentsRepository
let sut: FetchEstabilishmentsUseCase

describe('Fetch Estabilishments Use Case', () => {
  beforeEach(() => {
    estabilishmentsRepository = new InMemoryEstabilishmentsRepository()
    sut = new FetchEstabilishmentsUseCase(estabilishmentsRepository)
  })

  it('should be able to get users', async () => {
    await estabilishmentsRepository.create({
      estabilishment: 'estabilishment-01',
    })

    await estabilishmentsRepository.create({
      estabilishment: 'estabilishment-02',
    })

    const estabilishments = await sut.execute()

    expect(estabilishments).toEqual([
      expect.objectContaining({ estabilishment: 'estabilishment-01' }),
      expect.objectContaining({ estabilishment: 'estabilishment-02' }),
    ])
  })
})
