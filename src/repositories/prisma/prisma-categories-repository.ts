import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import {
  CategoriesRepository,
  UpdateCategoryOrderProps,
  UpdateCategoryProps,
} from '../categories-repository'

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findById(id: string) {
    const category = await prisma.categories.findUnique({
      where: {
        id,
      },
    })

    return category
  }

  async findByCategoryName(categoryName: string) {
    const category = await prisma.categories.findFirst({
      where: {
        category: categoryName,
      },
    })

    return category
  }

  async findByOrder(order: string) {
    const category = await prisma.categories.findFirst({
      where: {
        order,
      },
    })

    return category
  }

  async findMany() {
    const categories = await prisma.categories.findMany()

    return categories
  }

  async create(data: Prisma.CategoriesCreateInput) {
    const category = await prisma.categories.create({
      data: {
        category: data.category,
        color: data.color,
        order: data.order,
      },
    })

    return category
  }

  async update(data: UpdateCategoryProps) {
    const category = await prisma.categories.update({
      where: {
        id: data.id,
      },
      data: {
        category: data.category,
        color: data.color,
      },
    })

    return category
  }

  async updateOrder(data: UpdateCategoryOrderProps) {
    await prisma.categories.update({
      where: {
        id: data.id,
      },
      data: {
        order: data.order,
      },
    })
  }

  async delete(id: string) {
    await prisma.categories.delete({
      where: {
        id,
      },
    })
  }
}
