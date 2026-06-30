import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import {
  CreditCardsRepository,
  UpdateCreditCardProps,
} from '../credit-cards-repository'

export class PrismaCreditCardsRepository implements CreditCardsRepository {
  async findById(id: string) {
    return prisma.creditCards.findUnique({ where: { id } })
  }

  async findMany() {
    return prisma.creditCards.findMany({
      include: { owner: true },
      orderBy: { created_at: 'asc' },
    })
  }

  async create(data: Prisma.CreditCardsUncheckedCreateInput) {
    return prisma.creditCards.create({
      data: {
        name: data.name,
        limit: data.limit,
        closingDay: data.closingDay,
        dueDay: data.dueDay,
        color: data.color,
        ownerId: data.ownerId,
      },
      include: { owner: true },
    })
  }

  async update({ id, name, limit, closingDay, dueDay, color }: UpdateCreditCardProps) {
    return prisma.creditCards.update({
      where: { id },
      data: { name, limit, closingDay, dueDay, color },
      include: { owner: true },
    })
  }

  async delete(id: string) {
    await prisma.creditCards.delete({ where: { id } })
  }
}
