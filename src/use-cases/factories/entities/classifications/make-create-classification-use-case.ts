import { PrismaClassificationsRepository } from '@/repositories/prisma/prisma-classifications-repository'
import { CreateClassificationUseCase } from '@/use-cases/entities/classifications/create-classification'

export function makeCreateClassificationUseCase() {
  const classificationsRepository = new PrismaClassificationsRepository()
  const useCase = new CreateClassificationUseCase(classificationsRepository)

  return useCase
}
