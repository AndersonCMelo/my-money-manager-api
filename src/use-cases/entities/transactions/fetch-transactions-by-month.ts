import { TransactionsRepository } from '@/repositories/transactions-repository'
import { Transactions } from '@prisma/client'

interface FetchTransactionByMonthUseCaseRequest {
  month: string
}

type FetchTransactionByMonthUseCaseResponse = Transactions[]

export class FetchTransactionsByMonthUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    month,
  }: FetchTransactionByMonthUseCaseRequest): Promise<FetchTransactionByMonthUseCaseResponse> {
    const transactions = await this.transactionsRepository.findByMonth(month)

    return transactions
  }
}
