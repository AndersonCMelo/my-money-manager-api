import { PrismaEstabilishmentsRepository } from '@/repositories/prisma/prisma-estabilishments-repository'
import { UpdateEstabilishmentUseCase } from '@/use-cases/entities/estabilishments/update-estabilishment'

export function makeUpdateEstabilishmentUseCase() {
  const estabilishmentsRepository = new PrismaEstabilishmentsRepository()
  const useCase = new UpdateEstabilishmentUseCase(estabilishmentsRepository)

  return useCase
}
