import { PrismaClassificationsRepository } from '@/repositories/prisma/prisma-classifications-repository'
import { UpdateClassificationUseCase } from '@/use-cases/entities/classifications/update-classification'

export function makeUpdateClassificationUseCase() {
  const classificationsRepository = new PrismaClassificationsRepository()
  const useCase = new UpdateClassificationUseCase(classificationsRepository)

  return useCase
}
