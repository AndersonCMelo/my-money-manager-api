import { Prisma, Estabilishments } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { EstabilishmentsRepository } from '../estabilishments-repository'

export class InMemoryEstabilishmentsRepository
  implements EstabilishmentsRepository
{
  public items: Estabilishments[] = []

  async findById(id: string) {
    const estabilishment = this.items.find((item) => item.id === id)

    if (!estabilishment) {
      return null
    }

    return estabilishment
  }

  async findMany() {
    const estabilishments = this.items

    return estabilishments
  }

  async create(data: Prisma.EstabilishmentsCreateInput) {
    const estabilishment: Estabilishments = {
      id: randomUUID(),
      estabilishment: data.estabilishment,
      test: 'test', // TODO: remove
    }

    this.items.push(estabilishment)

    return estabilishment
  }

  async update(data: Prisma.EstabilishmentsCreateInput) {
    const estabilishmentIndex = this.items.findIndex(
      (item) => item.id === data.id,
    )

    if (estabilishmentIndex >= 0) {
      this.items[estabilishmentIndex].estabilishment = data.estabilishment
    }

    return this.items[estabilishmentIndex]
  }

  async delete(id: string) {
    const indexToRemove = this.items.findIndex((item) => item.id === id)

    this.items.splice(indexToRemove, 1)
  }
}
