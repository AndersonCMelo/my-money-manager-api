import { PrismaCreditCardsRepository } from '@/repositories/prisma/prisma-credit-cards-repository'
import { FetchCreditCardsUseCase } from '@/use-cases/entities/credit-cards/fetch-credit-cards'

export function makeFetchCreditCardsUseCase() {
  const creditCardsRepository = new PrismaCreditCardsRepository()
  return new FetchCreditCardsUseCase(creditCardsRepository)
}
