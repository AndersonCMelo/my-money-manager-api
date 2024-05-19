import { PrismaSettingsRepository } from '@/repositories/prisma/prisma-settings-repository'
import { FetchSettingsUseCase } from '@/use-cases/entities/settings/fetch-settings'

export function makeFetchSettingsUseCase() {
  const settingsRepository = new PrismaSettingsRepository()
  const useCase = new FetchSettingsUseCase(settingsRepository)

  return useCase
}
