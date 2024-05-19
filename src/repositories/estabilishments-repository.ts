import { Prisma, Estabilishments } from '@prisma/client'

export interface EstabilishmentsRepository {
  findById(id: string): Promise<Estabilishments | null>
  findMany(): Promise<Estabilishments[] | null>
  create(data: Prisma.EstabilishmentsCreateInput): Promise<Estabilishments>
  update(data: Prisma.EstabilishmentsCreateInput): Promise<Estabilishments>
  delete(id: string): Promise<void>
}
