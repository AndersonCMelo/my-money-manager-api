import { PrismaClassificationsRepository } from '@/repositories/prisma/prisma-classifications-repository'
import { UpdateClassificationOrderUseCase } from '@/use-cases/entities/classifications/update-classification-order'

export function makeUpdateClassificationOrderUseCase() {
  const classificationsRepository = new PrismaClassificationsRepository()
  const useCase = new UpdateClassificationOrderUseCase(
    classificationsRepository,
  )

  return useCase
}
