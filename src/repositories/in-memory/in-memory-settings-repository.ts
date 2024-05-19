import { Prisma, Settings } from '@prisma/client'
import { SettingsRepository } from '../settings-repository'
import { randomUUID } from 'node:crypto'

export class InMemorySettingsRepository implements SettingsRepository {
  public items: Settings[] = []

  async findById(id: string) {
    const settings = this.items.find((item) => item.id === id)

    if (!settings) {
      return null
    }

    return settings
  }

  async create(data: Prisma.SettingsCreateInput) {
    const settings: Settings = {
      id: randomUUID(),
      currency: data.currency,
      language: data.language ?? 'en',
    }

    this.items.push(settings)

    return settings
  }

  async findMany() {
    const settings = this.items

    return settings
  }

  async update(settings: Settings) {
    const settingsIndex = this.items.findIndex(
      (item) => item.id === settings.id,
    )

    if (settingsIndex >= 0) {
      this.items[settingsIndex].currency = settings.currency
      this.items[settingsIndex].language = settings.language
    }

    return settings
  }
}
