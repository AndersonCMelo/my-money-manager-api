import { Prisma, Classification } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import {
  ClassificationsRepository,
  UpdateClassificationOrderProps,
  UpdateClassificationProps,
} from '../classifications-repository'

export class InMemoryClassificationsRepository
  implements ClassificationsRepository
{
  public items: Classification[] = []

  async findById(id: string) {
    const classification = this.items.find((item) => item.id === id)

    if (!classification) {
      return null
    }

    return classification
  }

  async findByClassificationName(classificationName: string) {
    const classification = this.items.find(
      (item) => item.name === classificationName,
    )

    if (!classification) {
      return null
    }

    return classification
  }

  async findByOrder(order: number) {
    const classification = this.items.find((item) => item.order === order)

    if (!classification) {
      return null
    }

    return classification
  }

  async findMany() {
    const classifications = this.items

    return classifications
  }

  async create(data: Prisma.ClassificationCreateInput) {
    const classification: Classification = {
      id: randomUUID(),
      name: data.name,
      color: data.color,
      order: data.order!,
    }

    this.items.push(classification)

    return classification
  }

  async update({ id, name, color }: UpdateClassificationProps) {
    const classificationIndex = this.items.findIndex((item) => item.id === id)

    if (classificationIndex >= 0) {
      this.items[classificationIndex].name = name
      this.items[classificationIndex].color = color
    }

    return this.items[classificationIndex]
  }

  async updateOrder({ id, order }: UpdateClassificationOrderProps) {
    const classificationIndex = this.items.findIndex((item) => item.id === id)

    if (classificationIndex >= 0) {
      this.items[classificationIndex].order = order
    }
  }

  async delete(id: string) {
    const indexToRemove = this.items.findIndex((item) => item.id === id)

    this.items.splice(indexToRemove, 1)
  }
}
