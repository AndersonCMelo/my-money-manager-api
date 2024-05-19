import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEstabilishmentsRepository } from '@/repositories/in-memory/in-memory-estabilishments-repository'
import { CreateEstabilishmentUseCase } from './create-estabilishment'

let estabilishmentsRepository: InMemoryEstabilishmentsRepository
let sut: CreateEstabilishmentUseCase

describe('Create Estabilishment Use Case', () => {
  beforeEach(() => {
    estabilishmentsRepository = new InMemoryEstabilishmentsRepository()
    sut = new CreateEstabilishmentUseCase(estabilishmentsRepository)
  })

  it('should be able to create estabilishment', async () => {
    const { estabilishment } = await sut.execute({
      estabilishment: 'estabilishment-01',
    })

    expect(estabilishment.id).toEqual(expect.any(String))
  })
})
