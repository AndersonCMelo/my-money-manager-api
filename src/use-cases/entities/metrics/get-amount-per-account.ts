import { TransactionsRepository } from '@/repositories/transactions-repository'
import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'

interface GetAmountPerAccountUseCaseRequest {
  month: string
}

type GetAmountPerAccountUseCaseResponse = {
  accountId: string
  accountName: string
  amount: number
  percentage: number
}[]

type DataProps = {
  accountId: string
  accountName: string
  amount: number
  percentage: number
  totalIncome: number
  percentageIncome: number
  totalExpenses: number
  percentageExpenses: number
  totalTransfers: number
  percentageTransfers: number
}

export class GetAmountPerAccountUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private bankAccountsRepository: BankAccountsRepository,
  ) {}

  async execute({
    month,
  }: GetAmountPerAccountUseCaseRequest): Promise<GetAmountPerAccountUseCaseResponse> {
    const transactions = await this.transactionsRepository.findByMonth(month)

    if (!transactions) {
      throw new Error('Transactions not found.')
    }

    const bankAccounts = await this.bankAccountsRepository.findMany()

    if (!bankAccounts || bankAccounts.length === 0) {
      return []
    }

    const data: DataProps[] = []

    const initialValue = 0

    const totalTransactions = transactions.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      initialValue,
    )

    bankAccounts?.forEach((account) => {
      const transactionsOfAccount = transactions.filter(
        (item) => item.bankAccountId === account.id,
      )

      const amount = transactionsOfAccount.reduce(
        (accumulator, currentValue) => accumulator + currentValue.amount,
        initialValue,
      )

      const percentage = (amount * 100) / totalTransactions

      const totalIncome = transactionsOfAccount.reduce(
        (accumulator, currentValue) =>
          accumulator +
          (currentValue.type === 'income' ? currentValue.amount : 0),
        initialValue,
      )

      const totalExpenses = transactionsOfAccount.reduce(
        (accumulator, currentValue) =>
          accumulator +
          (currentValue.type === 'expense' ? currentValue.amount : 0),
        initialValue,
      )

      const totalTransfers = transactionsOfAccount.reduce(
        (accumulator, currentValue) =>
          accumulator +
          (currentValue.type === 'transfer' ? currentValue.amount : 0),
        initialValue,
      )

      const percentageIncome = (totalIncome * 100) / amount
      const percentageExpenses = (totalExpenses * 100) / amount
      const percentageTransfers = (totalTransfers * 100) / amount

      const object: DataProps = {
        accountId: account.id,
        accountName: account.accountLabel!,
        amount,
        percentage: Number(percentage.toFixed(1)),
        totalIncome,
        percentageIncome: Number(percentageIncome.toFixed(1)),
        totalExpenses,
        percentageExpenses: Number(percentageExpenses.toFixed(1)),
        totalTransfers,
        percentageTransfers: Number(percentageTransfers.toFixed(1)),
      }

      data.push(object)
    })

    return data.sort((a: DataProps, b: DataProps) => {
      return b.amount - a.amount
    })
  }
}
