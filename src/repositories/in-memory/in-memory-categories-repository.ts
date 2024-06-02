import { Prisma, Categories } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import {
  CategoriesRepository,
  UpdateCategoryOrderProps,
  UpdateCategoryProps,
} from '../categories-repository'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Categories[] = []

  async findById(id: string) {
    const category = this.items.find((item) => item.id === id)

    if (!category) {
      return null
    }

    return category
  }

  async findByCategoryName(categoryName: string) {
    const category = this.items.find((item) => item.category === categoryName)

    if (!category) {
      return null
    }

    return category
  }

  async findByOrder(order: number) {
    const category = this.items.find((item) => item.order === order)

    if (!category) {
      return null
    }

    return category
  }

  async findMany() {
    const categories = this.items

    return categories
  }

  async create(data: Prisma.CategoriesCreateInput) {
    const category: Categories = {
      id: randomUUID(),
      category: data.category,
      color: data.color,
      order: data.order!,
    }

    this.items.push(category)

    return category
  }

  async update({ id, category, color }: UpdateCategoryProps) {
    const categoryIndex = this.items.findIndex((item) => item.id === id)

    if (categoryIndex >= 0) {
      this.items[categoryIndex].category = category
      this.items[categoryIndex].color = color
    }

    return this.items[categoryIndex]
  }

  async updateOrder({ id, order }: UpdateCategoryOrderProps) {
    const categoryIndex = this.items.findIndex((item) => item.id === id)

    if (categoryIndex >= 0) {
      this.items[categoryIndex].order = order
    }
  }

  async delete(id: string) {
    const indexToRemove = this.items.findIndex((item) => item.id === id)

    this.items.splice(indexToRemove, 1)
  }
}
