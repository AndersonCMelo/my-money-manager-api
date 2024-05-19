import { PrismaEstabilishmentsRepository } from '@/repositories/prisma/prisma-estabilishments-repository'
import { CreateEstabilishmentUseCase } from '@/use-cases/entities/estabilishments/create-estabilishment'

export function makeCreateEstabilishmentUseCase() {
  const estabilishmentsRepository = new PrismaEstabilishmentsRepository()
  const useCase = new CreateEstabilishmentUseCase(estabilishmentsRepository)

  return useCase
}
