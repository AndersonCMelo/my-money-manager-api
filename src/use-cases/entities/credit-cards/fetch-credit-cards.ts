import { CreditCardsRepository } from '@/repositories/credit-cards-repository'

export class FetchCreditCardsUseCase {
  constructor(private creditCardsRepository: CreditCardsRepository) {}

  async execute() {
    const creditCards = await this.creditCardsRepository.findMany()

    return creditCards
  }
}
