import { TransactionsRepository } from '@/repositories/transactions-repository'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'
import { CreditCardsRepository } from '@/repositories/credit-cards-repository'
import { Transactions } from '@prisma/client'
import { calculateBalanceWhenCreateTransaction } from '@/utils/calculator/bank-account-balance/create-transaction'
import { randomUUID } from 'crypto'

interface CreateTransactionUseCaseRequest {
  description: string | null
  amount: number
  estabilishment: string | null
  type: 'income' | 'expense' | 'transfer' | 'credit_expense' | 'credit_payment'
  essencial: boolean
  date: string
  categoryId: string
  bankAccountId: string | null
  destinationBankAccountId: string | null
  creditCardId: string | null
  totalInstallments: number | null
}

interface CreateTransactionUseCaseResponse {
  transaction: Transactions
  installments?: Transactions[]
}

function calculateInstallmentBillingDate(
  purchaseDate: string,
  closingDay: number,
  dueDay: number,
  installmentIndex: number,
): string {
  const [year, month, day] = purchaseDate.split('-').map(Number)

  // Purchases made after the card closes for the month roll into next month's bill.
  let billingMonthIndex = month - 1 + installmentIndex
  if (day > closingDay) {
    billingMonthIndex += 1
  }

  const lastDayOfBillingMonth = new Date(
    year,
    billingMonthIndex + 1,
    0,
  ).getDate()
  const billingDay = Math.min(dueDay, lastDayOfBillingMonth)

  const billingDate = new Date(year, billingMonthIndex, billingDay)

  return [
    billingDate.getFullYear(),
    String(billingDate.getMonth() + 1).padStart(2, '0'),
    String(billingDate.getDate()).padStart(2, '0'),
  ].join('-')
}

export class CreateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categoriesRepository: CategoriesRepository,
    private bankAccountsRepository: BankAccountsRepository,
    private creditCardsRepository: CreditCardsRepository,
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
    creditCardId,
    totalInstallments,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new Error('Category not found.')
    }

    if (type === 'credit_expense') {
      if (!creditCardId) {
        throw new Error('Credit card is required for credit expenses.')
      }

      const creditCard = await this.creditCardsRepository.findById(creditCardId)

      if (!creditCard) {
        throw new Error('Credit card not found.')
      }

      const installmentCount = totalInstallments ?? 1
      const installmentAmount = Math.floor(amount / installmentCount)
      const installmentGroupId = randomUUID()

      const installments: Transactions[] = []

      for (let i = 0; i < installmentCount; i++) {
        const installment = await this.transactionsRepository.create({
          description,
          amount: installmentAmount,
          estabilishment,
          type,
          essencial,
          date: calculateInstallmentBillingDate(
            date,
            creditCard.closingDay,
            creditCard.dueDay,
            i,
          ),
          categoryId,
          bankAccountId: null,
          destinationBankAccountId: null,
          creditCardId,
          installmentGroupId,
          installmentNumber: i + 1,
          totalInstallments: installmentCount,
          isPaid: false,
        })

        installments.push(installment)
      }

      return {
        transaction: installments[0],
        ...(installmentCount > 1 ? { installments } : {}),
      }
    }

    if (type === 'credit_payment') {
      if (!bankAccountId) {
        throw new Error('Bank account is required for credit payments.')
      }

      if (!creditCardId) {
        throw new Error('Credit card is required for credit payments.')
      }

      const bankAccount =
        await this.bankAccountsRepository.findById(bankAccountId)

      if (!bankAccount) {
        throw new Error('Bank account not found.')
      }

      const creditCard = await this.creditCardsRepository.findById(creditCardId)

      if (!creditCard) {
        throw new Error('Credit card not found.')
      }

      const billingMonth = date.substring(0, 7)
      const installments =
        await this.transactionsRepository.findByCreditCardAndMonth(
          creditCardId,
          billingMonth,
        )

      if (installments.length === 0) {
        throw new Error('No pending installments found for this bill.')
      }

      const billAmount = installments.reduce(
        (total, installment) => total + installment.amount,
        0,
      )

      const transaction = await this.transactionsRepository.create({
        description,
        amount: billAmount,
        estabilishment,
        type,
        essencial,
        date,
        categoryId,
        bankAccountId,
        destinationBankAccountId: null,
        creditCardId,
        installmentGroupId: null,
        installmentNumber: null,
        totalInstallments: null,
        isPaid: false,
      })

      const { source } = calculateBalanceWhenCreateTransaction({
        transactionValue: billAmount,
        bankAccount,
        type: 'expense',
      })

      await this.bankAccountsRepository.updateBalance({
        id: bankAccountId,
        accountBalance: source,
      })

      await this.transactionsRepository.setPaidStatus(
        installments.map((installment) => installment.id),
        true,
      )

      return { transaction }
    }

    // income / expense / transfer
    const bankAccount = bankAccountId
      ? await this.bankAccountsRepository.findById(bankAccountId)
      : null

    if (!bankAccount) {
      throw new Error('Bank account not found.')
    }

    let destinationBankAccount = null

    if (type === 'transfer') {
      if (!destinationBankAccountId) {
        throw new Error('You need to provide a destination account.')
      }

      destinationBankAccount = await this.bankAccountsRepository.findById(
        destinationBankAccountId,
      )

      if (!destinationBankAccount) {
        throw new Error('Destination bank account not found.')
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
      destinationBankAccountId:
        type !== 'transfer' ? null : destinationBankAccountId,
      creditCardId: null,
      installmentGroupId: null,
      installmentNumber: null,
      totalInstallments: null,
      isPaid: false,
    })

    if (type === 'expense' || type === 'income') {
      const { source } = calculateBalanceWhenCreateTransaction({
        transactionValue: amount,
        bankAccount,
        type,
      })

      await this.bankAccountsRepository.updateBalance({
        id: bankAccountId!,
        accountBalance: source,
      })
    } else {
      const { source, destination } = calculateBalanceWhenCreateTransaction({
        transactionValue: amount,
        bankAccount,
        type,
        destinationBankAccount,
      })

      await this.bankAccountsRepository.updateBalance({
        id: bankAccountId!,
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
