import { expect, describe, it, beforeEach } from 'vitest'
import { InMemorySettingsRepository } from '@/repositories/in-memory/in-memory-settings-repository'
import { FetchSettingsUseCase } from './fetch-settings'

let settingsRepository: InMemorySettingsRepository
let sut: FetchSettingsUseCase

describe('Fetch Settings Use Case', () => {
  beforeEach(() => {
    settingsRepository = new InMemorySettingsRepository()
    sut = new FetchSettingsUseCase(settingsRepository)
  })

  it('should be able to get settings', async () => {
    await settingsRepository.create({
      currency: 'EUR',
      language: 'en',
    })

    const settings = await sut.execute()

    expect(settings).toEqual([expect.objectContaining({ currency: 'EUR' })])
  })
})
