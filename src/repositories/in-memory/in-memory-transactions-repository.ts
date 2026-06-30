import { Prisma, Transactions } from '@prisma/client'
import {
  TransactionsRepository,
  UpdateTransactionRequest,
} from '../transactions-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transactions[] = []

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findByMonth(month: string) {
    return this.items.filter((item) => item.date.substring(0, 7) === month)
  }

  async findMany() {
    return this.items
  }

  async findByCreditCardAndMonth(creditCardId: string, month: string) {
    return this.items.filter(
      (item) =>
        item.creditCardId === creditCardId &&
        item.type === 'credit_expense' &&
        item.date.startsWith(month),
    )
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
      categoryId: data.categoryId ?? null,
      bankAccountId: data.bankAccountId ?? null,
      destinationBankAccountId: data.destinationBankAccountId ?? null,
      creditCardId: data.creditCardId ?? null,
      installmentGroupId: data.installmentGroupId ?? null,
      installmentNumber: data.installmentNumber ?? null,
      totalInstallments: data.totalInstallments ?? null,
      isPaid: data.isPaid ?? false,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(transaction)

    return transaction
  }

  async update(data: UpdateTransactionRequest) {
    const index = this.items.findIndex((item) => item.id === data.id)

    if (index >= 0) {
      this.items[index].description = data.description ?? null
      this.items[index].estabilishment = data.estabilishment ?? null
      this.items[index].essencial = data.essencial ?? false
      this.items[index].date = data.date
      this.items[index].categoryId = data.categoryId ?? null
      this.items[index].updated_at = new Date()
    }

    return this.items[index]
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id === id)
    this.items.splice(index, 1)
  }

  async deleteByGroup(installmentGroupId: string) {
    this.items = this.items.filter(
      (item) => item.installmentGroupId !== installmentGroupId,
    )
  }

  async setPaidStatus(ids: string[], isPaid: boolean) {
    this.items = this.items.map((item) =>
      ids.includes(item.id) ? { ...item, isPaid } : item,
    )
  }
}
