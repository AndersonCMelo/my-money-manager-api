import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEstabilishmentsRepository } from '@/repositories/in-memory/in-memory-estabilishments-repository'
import { DeleteEstabilishmentUseCase } from './delete-estabilishment'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let estabilishmentsRepository: InMemoryEstabilishmentsRepository
let sut: DeleteEstabilishmentUseCase

describe('Delete Estabilishment Use Case', () => {
  beforeEach(() => {
    estabilishmentsRepository = new InMemoryEstabilishmentsRepository()
    sut = new DeleteEstabilishmentUseCase(estabilishmentsRepository)
  })

  it('should be able to delete a estabilishment', async () => {
    const createdEstabilishment = await estabilishmentsRepository.create({
      estabilishment: 'estabilishment-01',
    })

    await sut.execute({ estabilishmentId: createdEstabilishment.id })

    const estabilishments = await estabilishmentsRepository.findMany()

    await expect(estabilishments).toEqual([])
  })

  it('should not be able to delete an inexistent estabilishment', async () => {
    await expect(() =>
      sut.execute({ estabilishmentId: 'estabilishment-02' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
