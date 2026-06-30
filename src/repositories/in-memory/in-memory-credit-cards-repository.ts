import { Prisma, CreditCards } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import {
  CreditCardsRepository,
  UpdateCreditCardProps,
} from '../credit-cards-repository'

export class InMemoryCreditCardsRepository implements CreditCardsRepository {
  public items: CreditCards[] = []

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findMany() {
    return this.items
  }

  async create(data: Prisma.CreditCardsUncheckedCreateInput) {
    const creditCard: CreditCards = {
      id: randomUUID(),
      name: data.name,
      limit: data.limit,
      closingDay: data.closingDay,
      dueDay: data.dueDay,
      color: data.color ?? null,
      ownerId: data.ownerId ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(creditCard)

    return creditCard
  }

  async update({ id, name, limit, closingDay, dueDay, color }: UpdateCreditCardProps) {
    const index = this.items.findIndex((item) => item.id === id)

    this.items[index] = {
      ...this.items[index],
      name,
      limit,
      closingDay,
      dueDay,
      color: color ?? null,
      updated_at: new Date(),
    }

    return this.items[index]
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id === id)
    this.items.splice(index, 1)
  }
}
