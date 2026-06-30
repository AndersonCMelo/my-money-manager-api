import { PrismaCreditCardsRepository } from '@/repositories/prisma/prisma-credit-cards-repository'
import { UpdateCreditCardUseCase } from '@/use-cases/entities/credit-cards/update-credit-card'

export function makeUpdateCreditCardUseCase() {
  const creditCardsRepository = new PrismaCreditCardsRepository()
  return new UpdateCreditCardUseCase(creditCardsRepository)
}
