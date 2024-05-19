import { expect, describe, it, beforeEach } from 'vitest'
import { InMemorySettingsRepository } from '@/repositories/in-memory/in-memory-settings-repository'
import { UpdateSettingsUseCase } from './update-settings'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let settingsRepository: InMemorySettingsRepository
let sut: UpdateSettingsUseCase

describe('Update Settings Use Case', () => {
  beforeEach(() => {
    settingsRepository = new InMemorySettingsRepository()
    sut = new UpdateSettingsUseCase(settingsRepository)
  })

  it('should be able to update settings', async () => {
    const settings = await settingsRepository.create({
      currency: 'USD',
      language: 'en',
    })

    await sut.execute({
      id: settings.id,
      currency: 'EUR',
      language: 'en',
    })

    expect(settings).toEqual(expect.objectContaining({ currency: 'EUR' }))
  })

  it('should not be able to update inexistent settings', async () => {
    await expect(() =>
      sut.execute({
        id: 'settings-01',
        currency: 'EUR',
        language: 'english',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
