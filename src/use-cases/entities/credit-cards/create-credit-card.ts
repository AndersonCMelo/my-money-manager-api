import { CreditCardsRepository } from '@/repositories/credit-cards-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CreditCards } from '@prisma/client'

interface CreateCreditCardUseCaseRequest {
  name: string
  limit: number
  closingDay: number
  dueDay: number
  color?: string | null
  ownerId: string
}

interface CreateCreditCardUseCaseResponse {
  creditCard: CreditCards
}

export class CreateCreditCardUseCase {
  constructor(
    private creditCardsRepository: CreditCardsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    name,
    limit,
    closingDay,
    dueDay,
    color,
    ownerId,
  }: CreateCreditCardUseCaseRequest): Promise<CreateCreditCardUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const creditCard = await this.creditCardsRepository.create({
      name,
      limit,
      closingDay,
      dueDay,
      color,
      ownerId,
    })

    return { creditCard }
  }
}
