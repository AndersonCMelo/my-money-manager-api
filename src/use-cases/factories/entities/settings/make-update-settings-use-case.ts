import { PrismaSettingsRepository } from '@/repositories/prisma/prisma-settings-repository'
import { UpdateSettingsUseCase } from '@/use-cases/entities/settings/update-settings'

export function makeUpdateSettingsUseCase() {
  const settingsRepository = new PrismaSettingsRepository()
  const useCase = new UpdateSettingsUseCase(settingsRepository)

  return useCase
}
