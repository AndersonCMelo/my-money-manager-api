import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import {
  TransactionsRepository,
  UpdateTransactionRequest,
} from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async findById(id: string) {
    const transaction = await prisma.transactions.findUnique({
      where: {
        id,
      },
    })

    return transaction
  }

  async findByMonth(month: string) {
    const transactions = await prisma.transactions.findMany({
      where: {
        date: {
          startsWith: month,
        },
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        category: true,
        bankAccount: true,
      },
    })

    return transactions
  }

  async findMany() {
    const transactions = await prisma.transactions.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        category: true,
        bankAccount: true,
      },
    })

    return transactions
  }

  async create(data: Prisma.TransactionsUncheckedCreateInput) {
    const transaction = await prisma.transactions.create({
      data: {
        description: data.description,
        amount: data.amount,
        estabilishment: data.estabilishment,
        type: data.type,
        essencial: data.essencial,
        date: data.date,
        category: {
          connect: {
            id: data.categoryId!,
          },
        },
        bankAccount: {
          connect: {
            id: data.bankAccountId!,
          },
        },
        destinationBankAccountId: data.destinationBankAccountId!,
      },
      include: {
        category: true,
        bankAccount: true,
      },
    })

    return transaction
  }

  async update(data: UpdateTransactionRequest) {
    const transaction = await prisma.transactions.update({
      where: {
        id: data.id,
      },
      data: {
        description: data.description,
        // amount: data.amount,
        estabilishment: data.estabilishment,
        // type: data.type,
        essencial: data.essencial,
        date: data.date,
        category: {
          connect: {
            id: data.categoryId!,
          },
        },
        /* bankAccount: {
          connect: {
            id: data.bankAccountId!,
          },
        }, */
        // destinationBankAccountId: data.destinationBankAccountId!,
      },
      include: {
        category: true,
        bankAccount: true,
      },
    })

    return transaction
  }

  async delete(id: string) {
    await prisma.transactions.delete({
      where: {
        id,
      },
    })
  }
}
