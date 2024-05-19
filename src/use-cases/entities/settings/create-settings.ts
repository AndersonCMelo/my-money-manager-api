import { SettingsRepository } from '@/repositories/settings-repository'
import { Settings } from '@prisma/client'

interface CreateSettingsUseCaseRequest {
  currency: string
  language: string
}

interface CreateSettingsUseCaseResponse {
  settings: Settings
}

export class CreateSettingsUseCase {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute({
    currency,
    language,
  }: CreateSettingsUseCaseRequest): Promise<CreateSettingsUseCaseResponse> {
    const settings = await this.settingsRepository.create({
      currency,
      language,
    })

    return { settings }
  }
}
