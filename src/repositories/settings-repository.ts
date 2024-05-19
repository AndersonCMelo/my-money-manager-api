import { Prisma, Settings } from '@prisma/client'

export interface SettingsRepository {
  findById(id: string): Promise<Settings | null>
  findMany(): Promise<Settings[] | null>
  create(data: Prisma.SettingsCreateInput): Promise<Settings>
  update(data: Settings): Promise<Settings>
}
