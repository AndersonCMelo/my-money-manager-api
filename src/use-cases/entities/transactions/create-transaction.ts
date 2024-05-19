import { TransactionsRepository } from '@/repositories/transactions-repository'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'
import { Transactions } from '@prisma/client'
import { calculateBalanceWhenCreateTransaction } from '@/utils/calculator/bank-account-balance/create-transaction'

interface CreateTransactionUseCaseRequest {
  description: string | null
  amount: number
  estabilishment: string | null
  type: 'income' | 'expense' | 'transfer'
  essencial: boolean
  date: string
  categoryId: string
  bankAccountId: string
  destinationBankAccountId: string | null
}

interface CreateTransactionUseCaseResponse {
  transaction: Transactions
}

export class CreateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categoriesRepository: CategoriesRepository,
    private bankAccountsRepository: BankAccountsRepository,
  ) {}

  async execute({
    description,
    amount,
    estabilishment,
    type,
    essencial,
    date,
    categoryId,
    bankAccountId,
    destinationBankAccountId,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new Error('Category not found.')
    }

    const bankAccount =
      await this.bankAccountsRepository.findById(bankAccountId)

    if (!bankAccount) {
      throw new Error('Bank account not found.')
    }

    // TODO: Verify if the bank account has enough balance to create an expense transaction

    let destinationBankAccount = null

    if (type === 'transfer') {
      if (!destinationBankAccountId) {
        throw new Error('You need to provide a destination account.')
      } else {
        destinationBankAccount = await this.bankAccountsRepository.findById(
          destinationBankAccountId,
        )

        if (!destinationBankAccount) {
          throw new Error('Destination bank account not found.')
        }
      }
    }

    const transaction = await this.transactionsRepository.create({
      description,
      amount,
      estabilishment,
      type,
      essencial,
      date,
      categoryId,
      bankAccountId,
      destinationBankAccountId,
    })

    if (type === 'expense' || type === 'income') {
      const { source } = await calculateBalanceWhenCreateTransaction({
        transactionValue: amount,
        bankAccount,
        type,
      })

      await this.bankAccountsRepository.updateBalance({
        id: bankAccountId,
        accountBalance: source,
      })
    } else {
      const { source, destination } =
        await calculateBalanceWhenCreateTransaction({
          transactionValue: amount,
          bankAccount,
          type,
          destinationBankAccount,
        })

      await this.bankAccountsRepository.updateBalance({
        id: bankAccountId,
        accountBalance: source,
      })

      await this.bankAccountsRepository.updateBalance({
        id: destinationBankAccountId!,
        accountBalance: destination!,
      })
    }

    return { transaction }
  }
}
