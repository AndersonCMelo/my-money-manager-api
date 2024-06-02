import { TransactionsRepository } from '@/repositories/transactions-repository'

interface GetMonthlyPercentageUseCaseRequest {
  month: string
}

type GetMonthlyPercentageUseCaseResponse = {
  type: string
  amount: number
  percentage: number
}[]

export class GetMonthlyPercentageUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    month,
  }: GetMonthlyPercentageUseCaseRequest): Promise<GetMonthlyPercentageUseCaseResponse> {
    const transactions = await this.transactionsRepository.findByMonth(month)

    if (!transactions) {
      throw new Error('Transactions not found.')
    }

    const initialValue = 0

    const totalTransactions = transactions.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      initialValue,
    )

    const totalIncome = transactions.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (currentValue.type === 'income' ? currentValue.amount : 0),
      initialValue,
    )

    const totalExpenses = transactions.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (currentValue.type === 'expense' ? currentValue.amount : 0),
      initialValue,
    )

    const totalTransfers = transactions.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (currentValue.type === 'transfer' ? currentValue.amount : 0),
      initialValue,
    )

    const percentOfIncome = (totalIncome * 100) / totalTransactions
    const percentOfExpenses = (totalExpenses * 100) / totalTransactions
    const percentOfTransfers = (totalTransfers * 100) / totalTransactions

    const data = [
      {
        type: 'Income',
        amount: totalIncome,
        percentage: Number(percentOfIncome.toFixed(1)),
      },
      {
        type: 'Expenses',
        amount: totalExpenses,
        percentage: Number(percentOfExpenses.toFixed(1)),
      },
      {
        type: 'Transfers',
        amount: totalTransfers,
        percentage: Number(percentOfTransfers.toFixed(1)),
      },
    ]

    return data
  }
}
