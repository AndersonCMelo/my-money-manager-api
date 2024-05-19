import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import {
  BankAccountsRepository,
  UpdateBalanceProps,
} from '../bank-accounts-repository'

export class PrismaBankAccountsRepository implements BankAccountsRepository {
  async findById(id: string) {
    const bankAccount = await prisma.bankAccounts.findUnique({
      where: {
        id,
      },
    })

    return bankAccount
  }

  async findMany() {
    const bankAccounts = await prisma.bankAccounts.findMany({
      include: {
        owner: true,
      },
    })

    return bankAccounts
  }

  async create(data: Prisma.BankAccountsUncheckedCreateInput) {
    const bankAccount = await prisma.bankAccounts.create({
      data: {
        bankName: data.bankName,
        accountLabel: data.accountLabel,
        openingBalance: data.openingBalance,
        accountBalance: data.accountBalance,
        type: data.type,
        owner: {
          connect: {
            id: data.ownerId!,
          },
        },
      },
      include: {
        owner: true,
      },
    })

    return bankAccount
  }

  async update(data: Prisma.BankAccountsUncheckedCreateInput) {
    const bankAccount = await prisma.bankAccounts.update({
      where: {
        id: data.id,
      },
      data: {
        bankName: data.bankName,
        accountLabel: data.accountLabel,
        openingBalance: data.openingBalance,
        accountBalance: data.accountBalance,
        type: data.type,
        owner: {
          connect: {
            id: data.ownerId!,
          },
        },
      },
      include: {
        owner: true,
      },
    })

    return bankAccount
  }

  async updateBalance(data: UpdateBalanceProps) {
    const bankAccount = await prisma.bankAccounts.update({
      where: {
        id: data.id,
      },
      data: {
        accountBalance: data.accountBalance,
      },
      include: {
        owner: true,
      },
    })

    return bankAccount
  }

  async delete(id: string) {
    await prisma.bankAccounts.delete({
      where: {
        id,
      },
    })
  }
}
