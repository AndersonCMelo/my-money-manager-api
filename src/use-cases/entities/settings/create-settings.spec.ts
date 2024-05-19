import { expect, describe, it, beforeEach } from 'vitest'
import { InMemorySettingsRepository } from '@/repositories/in-memory/in-memory-settings-repository'
import { CreateSettingsUseCase } from './create-settings'

let settingsRepository: InMemorySettingsRepository
let sut: CreateSettingsUseCase

describe('Create Settings Use Case', () => {
  beforeEach(() => {
    settingsRepository = new InMemorySettingsRepository()
    sut = new CreateSettingsUseCase(settingsRepository)
  })

  it('should be able to create settings', async () => {
    const { settings } = await sut.execute({
      currency: 'EUR',
      language: 'english',
    })

    expect(settings.id).toEqual(expect.any(String))
  })
})
