import { PrismaClassificationsRepository } from '@/repositories/prisma/prisma-classifications-repository'
import { DeleteClassificationUseCase } from '@/use-cases/entities/classifications/delete-classification'

export function makeDeleteClassificationUseCase() {
  const classificationsRepository = new PrismaClassificationsRepository()
  const useCase = new DeleteClassificationUseCase(classificationsRepository)

  return useCase
}
