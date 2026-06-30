import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { CreateTransactionUseCase } from '@/use-cases/entities/transactions/create-transaction'
import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository'
import { PrismaBankAccountsRepository } from '@/repositories/prisma/prisma-bank-accounts-repository'
import { PrismaCreditCardsRepository } from '@/repositories/prisma/prisma-credit-cards-repository'

export function makeCreateTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const bankAccountsRepository = new PrismaBankAccountsRepository()
  const creditCardsRepository = new PrismaCreditCardsRepository()

  return new CreateTransactionUseCase(
    transactionsRepository,
    categoriesRepository,
    bankAccountsRepository,
    creditCardsRepository,
  )
}
