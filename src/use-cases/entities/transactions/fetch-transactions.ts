import { TransactionsRepository } from '@/repositories/transactions-repository'

export class FetchTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute() {
    const transactions = await this.transactionsRepository.findMany()

    return transactions
  }
}
