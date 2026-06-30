import { PrismaCreditCardsRepository } from '@/repositories/prisma/prisma-credit-cards-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateCreditCardUseCase } from '@/use-cases/entities/credit-cards/create-credit-card'

export function makeCreateCreditCardUseCase() {
  const creditCardsRepository = new PrismaCreditCardsRepository()
  const usersRepository = new PrismaUsersRepository()
  return new CreateCreditCardUseCase(creditCardsRepository, usersRepository)
}
