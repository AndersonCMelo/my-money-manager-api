import { PrismaEstabilishmentsRepository } from '@/repositories/prisma/prisma-estabilishments-repository'
import { DeleteEstabilishmentUseCase } from '@/use-cases/entities/estabilishments/delete-estabilishment'

export function makeDeleteEstabilishmentUseCase() {
  const estabilishmentsRepository = new PrismaEstabilishmentsRepository()
  const useCase = new DeleteEstabilishmentUseCase(estabilishmentsRepository)

  return useCase
}
