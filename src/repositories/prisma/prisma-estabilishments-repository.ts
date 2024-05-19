import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { EstabilishmentsRepository } from '../estabilishments-repository'

export class PrismaEstabilishmentsRepository
  implements EstabilishmentsRepository
{
  async findById(id: string) {
    const estabilishment = await prisma.estabilishments.findUnique({
      where: {
        id,
      },
    })

    return estabilishment
  }

  async findMany() {
    const estabilishments = await prisma.estabilishments.findMany({})

    return estabilishments
  }

  async create(data: Prisma.EstabilishmentsCreateInput) {
    const estabilishment = await prisma.estabilishments.create({
      data: {
        estabilishment: data.estabilishment,
      },
    })

    return estabilishment
  }

  async update(data: Prisma.EstabilishmentsCreateInput) {
    const estabilishment = await prisma.estabilishments.update({
      where: {
        id: data.id,
      },
      data: {
        estabilishment: data.estabilishment,
      },
    })

    return estabilishment
  }

  async delete(id: string) {
    await prisma.estabilishments.delete({
      where: {
        id,
      },
    })
  }
}
