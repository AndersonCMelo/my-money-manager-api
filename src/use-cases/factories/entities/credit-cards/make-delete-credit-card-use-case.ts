import { PrismaCreditCardsRepository } from '@/repositories/prisma/prisma-credit-cards-repository'
import { DeleteCreditCardUseCase } from '@/use-cases/entities/credit-cards/delete-credit-card'

export function makeDeleteCreditCardUseCase() {
  const creditCardsRepository = new PrismaCreditCardsRepository()
  return new DeleteCreditCardUseCase(creditCardsRepository)
}
