import { PrismaEstabilishmentsRepository } from '@/repositories/prisma/prisma-estabilishments-repository'
import { FetchEstabilishmentsUseCase } from '@/use-cases/entities/estabilishments/fetch-estabilishments'

export function makeFetchEstabilishmentUseCase() {
  const estabilishmentsRepository = new PrismaEstabilishmentsRepository()
  const useCase = new FetchEstabilishmentsUseCase(estabilishmentsRepository)

  return useCase
}
