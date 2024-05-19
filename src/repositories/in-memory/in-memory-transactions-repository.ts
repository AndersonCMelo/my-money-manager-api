import { Prisma, Transactions } from '@prisma/client'
import {
  TransactionsRepository,
  UpdateTransactionRequest,
} from '../transactions-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transactions[] = []

  async findById(id: string) {
    const transaction = this.items.find((item) => item.id === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async findByMonth(month: string) {
    const transactions = this.items.filter(
      (item) => item.date.substring(0, 7) === month,
    )

    return transactions
  }

  async findMany() {
    const transactions = this.items

    return transactions
  }

  async create(data: Prisma.TransactionsUncheckedCreateInput) {
    const transaction: Transactions = {
      id: randomUUID(),
      description: data.description ?? null,
      amount: data.amount,
      estabilishment: data.estabilishment ?? null,
      type: data.type,
      essencial: data.essencial ?? false,
      date: data.date,
      categoryId: data.categoryId!,
      bankAccountId: data.bankAccountId!,
      destinationBankAccountId: data.destinationBankAccountId ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(transaction)

    return transaction
  }

  async update(data: UpdateTransactionRequest) {
    const transactionsIndex = this.items.findIndex(
      (item) => item.id === data.id,
    )

    if (transactionsIndex >= 0) {
      this.items[transactionsIndex].description = data.description ?? null
      this.items[transactionsIndex].estabilishment = data.estabilishment ?? null
      this.items[transactionsIndex].essencial = data.essencial ?? false
      this.items[transactionsIndex].date = data.date
      this.items[transactionsIndex].categoryId = data.categoryId!
      this.items[transactionsIndex].updated_at = new Date()
    }

    return this.items[transactionsIndex]
  }

  async delete(id: string) {
    const indexToRemove = this.items.findIndex((item) => item.id === id)

    this.items.splice(indexToRemove, 1)
  }
}
