import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { DeleteTransactionUseCase } from '@/use-cases/entities/transactions/delete-transaction'
import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'
import { PrismaCreditCardsRepository } from '@/repositories/prisma/prisma-credit-cards-repository'

export function makeDeleteTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const creditCardsRepository = new PrismaCreditCardsRepository()
  const useCase = new DeleteTransactionUseCase(
    transactionsRepository,
    bankAccountsRepository,
    creditCardsRepository,
  )

  return useCase
}
