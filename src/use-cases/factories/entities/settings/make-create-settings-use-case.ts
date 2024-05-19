import { CreateSettingsUseCase } from '@/use-cases/entities/settings/create-settings'
import { PrismaSettingsRepository } from '@/repositories/prisma/prisma-settings-repository'

export function makeCreateSettingsUseCase() {
  const settingsRepository = new PrismaSettingsRepository()
  const useCase = new CreateSettingsUseCase(settingsRepository)

  return useCase
}
