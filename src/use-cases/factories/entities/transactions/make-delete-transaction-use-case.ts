import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { DeleteTransactionUseCase } from '@/use-cases/entities/transactions/delete-transaction'
import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'

export function makeDeleteTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const useCase = new DeleteTransactionUseCase(
    transactionsRepository,
    bankAccountsRepository,
  )

  return useCase
}
