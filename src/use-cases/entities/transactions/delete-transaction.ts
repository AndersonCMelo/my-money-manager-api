import { TransactionsRepository } from '@/repositories/transactions-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'
import { CreditCardsRepository } from '@/repositories/credit-cards-repository'
import { calculateBalanceWhenDeleteTransaction } from '@/utils/calculator/bank-account-balance/delete-transaction'
import { calculateInstallmentBillingDate } from '@/utils/calculator/credit-card/calculate-installment-billing-date'

interface DeleteTransactionUseCaseRequest {
  id: string
  deleteGroup?: boolean
}

export class DeleteTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private bankAccountsRepository: BankAccountsRepository,
    private creditCardsRepository: CreditCardsRepository,
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
        const creditCard = await this.creditCardsRepository.findById(
          transaction.creditCardId,
        )

        if (creditCard) {
          const billingMonth = transaction.date.substring(0, 7)
          const cardInstallments =
            await this.transactionsRepository.findByCreditCard(
              transaction.creditCardId,
            )

          const installments = cardInstallments.filter(
            (installment) =>
              installment.isPaid &&
              calculateInstallmentBillingDate(
                installment.date,
                creditCard.closingDay,
                creditCard.dueDay,
              ).startsWith(billingMonth),
          )

          if (installments.length > 0) {
            await this.transactionsRepository.setPaidStatus(
              installments.map((installment) => installment.id),
              false,
            )
          }
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
