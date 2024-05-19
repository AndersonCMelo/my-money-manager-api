import { Prisma, BankAccounts } from '@prisma/client'
import {
  BankAccountsRepository,
  UpdateBalanceProps,
} from '../bank-accounts-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryBankAccountsRepository implements BankAccountsRepository {
  public items: BankAccounts[] = []

  async findById(id: string) {
    const bankAccounts = this.items.find((item) => item.id === id)

    if (!bankAccounts) {
      return null
    }

    return bankAccounts
  }

  async findMany() {
    const bankAccounts = this.items

    return bankAccounts
  }

  async create(data: Prisma.BankAccountsUncheckedCreateInput) {
    if (!data.ownerId) {
      throw new Error('You need to provide an owner')
    }

    const bankAccount: BankAccounts = {
      id: randomUUID(),
      bankName: data.bankName,
      accountLabel: data.accountLabel ?? null,
      openingBalance: data.openingBalance,
      accountBalance: data.accountBalance,
      type: data.type ?? null,
      ownerId: data.ownerId,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(bankAccount)

    return bankAccount
  }

  async update(data: Prisma.BankAccountsUncheckedCreateInput) {
    const bankAccountsIndex = this.items.findIndex(
      (item) => item.id === data.id,
    )

    if (bankAccountsIndex >= 0) {
      this.items[bankAccountsIndex].accountBalance = data.accountBalance
      this.items[bankAccountsIndex].accountLabel = data.accountLabel ?? null
      this.items[bankAccountsIndex].bankName = data.bankName
      this.items[bankAccountsIndex].openingBalance = data.openingBalance
      this.items[bankAccountsIndex].type = data.type ?? null
      this.items[bankAccountsIndex].ownerId = data.ownerId ?? null
      this.items[bankAccountsIndex].updated_at = new Date()
    }

    return this.items[bankAccountsIndex]
  }

  async updateBalance(data: UpdateBalanceProps) {
    const bankAccountsIndex = this.items.findIndex(
      (item) => item.id === data.id,
    )

    if (bankAccountsIndex >= 0) {
      this.items[bankAccountsIndex].accountBalance = data.accountBalance
      this.items[bankAccountsIndex].updated_at = new Date()
    }

    return this.items[bankAccountsIndex]
  }

  async delete(id: string) {
    const indexToRemove = this.items.findIndex((item) => item.id === id)

    this.items.splice(indexToRemove, 1)
  }
}
