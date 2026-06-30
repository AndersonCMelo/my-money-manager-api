import { TransactionsRepository } from '@/repositories/transactions-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'
import { calculateBalanceWhenDeleteTransaction } from '@/utils/calculator/bank-account-balance/delete-transaction'

interface DeleteTransactionUseCaseRequest {
  id: string
  deleteGroup?: boolean
}

export class DeleteTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private bankAccountsRepository: BankAccountsRepository,
  ) {}

  async execute({ id, deleteGroup = false }: DeleteTransactionUseCaseRequest) {
    const transaction = await this.transactionsRepository.findById(id)

    if (!transaction) {
      throw new ResourceNotFoundError()
    }

    if (transaction.type === 'credit_expense') {
      if (deleteGroup && transaction.installmentGroupId) {
        await this.transactionsRepository.deleteByGroup(
          transaction.installmentGroupId,
        )
      } else {
        await this.transactionsRepository.delete(id)
      }
      return
    }

    await this.transactionsRepository.delete(id)

    const bankAccount = await this.bankAccountsRepository.findById(
      transaction.bankAccountId!,
    )

    if (!bankAccount) {
      return
    }

    if (
      transaction.type === 'expense' ||
      transaction.type === 'income' ||
      transaction.type === 'credit_payment'
    ) {
      const balanceType =
        transaction.type === 'credit_payment' ? 'expense' : transaction.type

      const { source } = calculateBalanceWhenDeleteTransaction({
        transactionValue: transaction.amount,
        bankAccount,
        type: balanceType,
      })

      await this.bankAccountsRepository.updateBalance({
        id: bankAccount.id,
        accountBalance: source,
      })

      if (transaction.type === 'credit_payment' && transaction.creditCardId) {
        const billingMonth = transaction.date.substring(0, 7)
        const installments =
          await this.transactionsRepository.findByCreditCardAndMonth(
            transaction.creditCardId,
            billingMonth,
          )

        if (installments.length > 0) {
          await this.transactionsRepository.setPaidStatus(
            installments.map((installment) => installment.id),
            false,
          )
        }
      }
    } else {
      const destinationBankAccount = await this.bankAccountsRepository.findById(
        transaction.destinationBankAccountId!,
      )

      if (!destinationBankAccount) {
        const { source } = calculateBalanceWhenDeleteTransaction({
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
        const { source, destination } = calculateBalanceWhenDeleteTransaction({
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
