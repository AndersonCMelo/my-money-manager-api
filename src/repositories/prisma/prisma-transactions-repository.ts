import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import {
  TransactionsRepository,
  UpdateTransactionRequest,
} from '../transactions-repository'

const defaultInclude = {
  category: true,
  bankAccount: true,
  creditCard: true,
}

export class PrismaTransactionsRepository implements TransactionsRepository {
  async findById(id: string) {
    return prisma.transactions.findUnique({ where: { id } })
  }

  async findByMonth(month: string) {
    return prisma.transactions.findMany({
      where: {
        date: { startsWith: month },
      },
      orderBy: { date: 'desc' },
      include: defaultInclude,
    })
  }

  async findMany() {
    return prisma.transactions.findMany({
      orderBy: { date: 'desc' },
      include: defaultInclude,
    })
  }

  async findByCreditCardAndMonth(creditCardId: string, month: string) {
    return prisma.transactions.findMany({
      where: {
        creditCardId,
        type: 'credit_expense',
        date: { startsWith: month },
      },
    })
  }

  async create(data: Prisma.TransactionsUncheckedCreateInput) {
    return prisma.transactions.create({
      data: {
        description: data.description,
        amount: data.amount,
        estabilishment: data.estabilishment,
        type: data.type,
        essencial: data.essencial,
        date: data.date,
        categoryId: data.categoryId ?? undefined,
        bankAccountId: data.bankAccountId ?? undefined,
        destinationBankAccountId: data.destinationBankAccountId,
        creditCardId: data.creditCardId ?? undefined,
        installmentGroupId: data.installmentGroupId ?? undefined,
        installmentNumber: data.installmentNumber ?? undefined,
        totalInstallments: data.totalInstallments ?? undefined,
        isPaid: data.isPaid ?? false,
      },
      include: defaultInclude,
    })
  }

  async update(data: UpdateTransactionRequest) {
    return prisma.transactions.update({
      where: { id: data.id },
      data: {
        description: data.description,
        estabilishment: data.estabilishment,
        essencial: data.essencial,
        date: data.date,
        ...(data.categoryId
          ? { category: { connect: { id: data.categoryId } } }
          : {}),
      },
      include: defaultInclude,
    })
  }

  async delete(id: string) {
    await prisma.transactions.delete({ where: { id } })
  }

  async deleteByGroup(installmentGroupId: string) {
    await prisma.transactions.deleteMany({
      where: { installmentGroupId },
    })
  }

  async setPaidStatus(ids: string[], isPaid: boolean) {
    await prisma.transactions.updateMany({
      where: { id: { in: ids } },
      data: { isPaid },
    })
  }
}
