import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { GetMonthlyPercentageUseCase } from '@/use-cases/entities/metrics/get-monthly-percentage'

export function makeGetMonthlyPercentageUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new GetMonthlyPercentageUseCase(transactionsRepository)

  return useCase
}
