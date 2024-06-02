import { PrismaClassificationsRepository } from '@/repositories/prisma/prisma-classifications-repository'
import { FetchClassificationsUseCase } from '@/use-cases/entities/classifications/fetch-classifications'

export function makeFetchClassificationUseCase() {
  const classificationsRepository = new PrismaClassificationsRepository()
  const useCase = new FetchClassificationsUseCase(classificationsRepository)

  return useCase
}
