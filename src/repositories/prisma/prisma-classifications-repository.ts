import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import {
  ClassificationsRepository,
  UpdateClassificationOrderProps,
  UpdateClassificationProps,
} from '../classifications-repository'

export class PrismaClassificationsRepository
  implements ClassificationsRepository
{
  async findById(id: string) {
    const classification = await prisma.classification.findUnique({
      where: {
        id,
      },
    })

    return classification
  }

  async findByClassificationName(classificationName: string) {
    const classification = await prisma.classification.findFirst({
      where: {
        name: classificationName,
      },
    })

    return classification
  }

  async findByOrder(order: number) {
    const classification = await prisma.classification.findFirst({
      where: {
        order,
      },
    })

    return classification
  }

  async findMany() {
    const classifications = await prisma.classification.findMany()

    return classifications
  }

  async create(data: Prisma.ClassificationCreateInput) {
    const classification = await prisma.classification.create({
      data: {
        name: data.name,
        color: data.color,
        order: data.order,
      },
    })

    return classification
  }

  async update(data: UpdateClassificationProps) {
    const classification = await prisma.classification.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        color: data.color,
      },
    })

    return classification
  }

  async updateOrder(data: UpdateClassificationOrderProps) {
    await prisma.classification.update({
      where: {
        id: data.id,
      },
      data: {
        order: data.order,
      },
    })
  }

  async delete(id: string) {
    await prisma.classification.delete({
      where: {
        id,
      },
    })
  }
}
