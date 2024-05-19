import { TransactionsRepository } from '@/repositories/transactions-repository'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { Transactions } from '@prisma/client'

interface UpdateTransactionsUseCaseRequest {
  id: string
  description: string | null
  estabilishment: string | null
  essencial: boolean
  date: string
  categoryId: string
}

interface UpdateTransactionsUseCaseResponse {
  transactions: Transactions
}

export class UpdateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    id,
    description,
    estabilishment,
    essencial,
    date,
    categoryId,
  }: UpdateTransactionsUseCaseRequest): Promise<UpdateTransactionsUseCaseResponse> {
    const existentTransactions = await this.transactionsRepository.findById(id)

    if (!existentTransactions) {
      throw new ResourceNotFoundError()
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new Error('Category not found.')
    }

    const transactions = await this.transactionsRepository.update({
      id,
      description,
      estabilishment,
      essencial,
      date,
      categoryId,
    })

    return { transactions }
  }
}
