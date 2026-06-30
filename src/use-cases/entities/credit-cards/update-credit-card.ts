import { CreditCardsRepository } from '@/repositories/credit-cards-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CreditCards } from '@prisma/client'

interface UpdateCreditCardUseCaseRequest {
  id: string
  name: string
  limit: number
  closingDay: number
  dueDay: number
  color?: string | null
}

interface UpdateCreditCardUseCaseResponse {
  creditCard: CreditCards
}

export class UpdateCreditCardUseCase {
  constructor(private creditCardsRepository: CreditCardsRepository) {}

  async execute({
    id,
    name,
    limit,
    closingDay,
    dueDay,
    color,
  }: UpdateCreditCardUseCaseRequest): Promise<UpdateCreditCardUseCaseResponse> {
    const existing = await this.creditCardsRepository.findById(id)

    if (!existing) {
      throw new ResourceNotFoundError()
    }

    const creditCard = await this.creditCardsRepository.update({
      id,
      name,
      limit,
      closingDay,
      dueDay,
      color,
    })

    return { creditCard }
  }
}
