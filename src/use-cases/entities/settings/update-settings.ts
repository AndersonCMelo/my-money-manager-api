import { SettingsRepository } from '@/repositories/settings-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { Settings } from '@prisma/client'

interface UpdateSettingsUseCaseRequest {
  id: string
  currency: string
  language: string
}

interface UpdateSettingsUseCaseResponse {
  settings: Settings
}

export class UpdateSettingsUseCase {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute({
    id,
    currency,
    language,
  }: UpdateSettingsUseCaseRequest): Promise<UpdateSettingsUseCaseResponse> {
    const existentSettings = await this.settingsRepository.findById(id)

    if (!existentSettings) {
      throw new ResourceNotFoundError()
    }

    const settings = await this.settingsRepository.update({
      id,
      currency,
      language,
    })

    return { settings }
  }
}
