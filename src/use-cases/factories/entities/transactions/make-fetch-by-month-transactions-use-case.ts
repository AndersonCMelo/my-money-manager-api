import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { FetchTransactionsByMonthUseCase } from '@/use-cases/entities/transactions/fetch-transactions-by-month'

export function makeFetchTransactionsByMonthUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new FetchTransactionsByMonthUseCase(transactionsRepository)

  return useCase
}
