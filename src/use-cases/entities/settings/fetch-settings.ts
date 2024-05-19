import { SettingsRepository } from '@/repositories/settings-repository'

export class FetchSettingsUseCase {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute() {
    const settings = await this.settingsRepository.findMany()

    return settings
  }
}
