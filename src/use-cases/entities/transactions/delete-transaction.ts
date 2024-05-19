import { TransactionsRepository } from '@/repositories/transactions-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'
import { calculateBalanceWhenDeleteTransaction } from '@/utils/calculator/bank-account-balance/delete-transaction'

interface DeleteTransactionUseCaseRequest {
  id: string
}

export class DeleteTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private bankAccountsRepository: BankAccountsRepository,
  ) {}

  async execute({ id }: DeleteTransactionUseCaseRequest) {
    const transaction = await this.transactionsRepository.findById(id)

    if (!transaction) {
      throw new ResourceNotFoundError()
    }

    await this.transactionsRepository.delete(id)

    const bankAccount = await this.bankAccountsRepository.findById(
      transaction.bankAccountId!,
    )

    if (!bankAccount) {
      return
    }

    if (transaction.type === 'expense' || transaction.type === 'income') {
      const { source } = await calculateBalanceWhenDeleteTransaction({
        transactionValue: transaction.amount,
        bankAccount,
        type: transaction.type,
      })

      await this.bankAccountsRepository.updateBalance({
        id: bankAccount.id,
        accountBalance: source,
      })
    } else {
      const destinationBankAccount = await this.bankAccountsRepository.findById(
        transaction.destinationBankAccountId!,
      )

      if (!destinationBankAccount) {
        const { source } = await calculateBalanceWhenDeleteTransaction({
          transactionValue: transaction.amount,
          bankAccount,
          type: 'transfer',
          destinationBankAccount: null,
        })

        await this.bankAccountsRepository.updateBalance({
          id: bankAccount.id,
          accountBalance: source,
        })
      } else {
        const { source, destination } =
          await calculateBalanceWhenDeleteTransaction({
            transactionValue: transaction.amount,
            bankAccount,
            type: 'transfer',
            destinationBankAccount,
          })

        await this.bankAccountsRepository.updateBalance({
          id: bankAccount.id,
          accountBalance: source,
        })

        await this.bankAccountsRepository.updateBalance({
          id: destinationBankAccount.id,
          accountBalance: destination!,
        })
      }
    }
  }
}
