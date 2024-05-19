import { prisma } from '@/lib/prisma'
import { Prisma, Settings } from '@prisma/client'

import { SettingsRepository } from '../settings-repository'

export class PrismaSettingsRepository implements SettingsRepository {
  async findById(id: string) {
    const settings = await prisma.settings.findUnique({
      where: {
        id,
      },
    })

    return settings
  }

  async findMany() {
    const settings = await prisma.settings.findMany()

    return settings
  }

  async create(data: Prisma.SettingsCreateInput) {
    const settings = await prisma.settings.create({
      data: {
        currency: data.currency,
        language: data.language,
      },
    })

    return settings
  }

  async update(data: Settings) {
    const settings = await prisma.settings.update({
      where: {
        id: data.id,
      },
      data: {
        currency: data.currency,
        language: data.language,
      },
    })

    return settings
  }
}
