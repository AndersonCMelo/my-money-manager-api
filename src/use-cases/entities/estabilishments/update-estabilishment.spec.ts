import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEstabilishmentsRepository } from '@/repositories/in-memory/in-memory-estabilishments-repository'
import { UpdateEstabilishmentUseCase } from './update-estabilishment'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let estabilishmentsRepository: InMemoryEstabilishmentsRepository
let sut: UpdateEstabilishmentUseCase

describe('Update Settings Use Case', () => {
  beforeEach(() => {
    estabilishmentsRepository = new InMemoryEstabilishmentsRepository()
    sut = new UpdateEstabilishmentUseCase(estabilishmentsRepository)
  })

  it('should be able to update an estabilishment', async () => {
    const estabilishment = await estabilishmentsRepository.create({
      estabilishment: 'estabilishment-01',
    })

    await sut.execute({
      id: estabilishment.id,
      estabilishment: 'estabilishment-01-edited',
    })

    expect(estabilishment).toEqual(
      expect.objectContaining({ estabilishment: 'estabilishment-01-edited' }),
    )
  })

  it('should not be able to update an inexistent estabilishment', async () => {
    await expect(() =>
      sut.execute({
        id: 'estabilishment-01',
        estabilishment: 'estabilishment-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
