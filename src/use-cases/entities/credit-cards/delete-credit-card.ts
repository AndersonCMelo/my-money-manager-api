import { CreditCardsRepository } from '@/repositories/credit-cards-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface DeleteCreditCardUseCaseRequest {
  id: string
}

export class DeleteCreditCardUseCase {
  constructor(private creditCardsRepository: CreditCardsRepository) {}

  async execute({ id }: DeleteCreditCardUseCaseRequest): Promise<void> {
    const creditCard = await this.creditCardsRepository.findById(id)

    if (!creditCard) {
      throw new ResourceNotFoundError()
    }

    await this.creditCardsRepository.delete(id)
  }
}
