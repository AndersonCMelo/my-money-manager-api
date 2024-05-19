import { Prisma, Transactions } from '@prisma/client'

export interface UpdateTransactionRequest {
  id: string
  description: string | null
  estabilishment: string | null
  essencial: boolean
  date: string
  categoryId: string
}

export interface TransactionsRepository {
  findById(id: string): Promise<Transactions | null>
  findByMonth(month: string): Promise<Transactions[]>
  findMany(): Promise<Transactions[]>
  create(data: Prisma.TransactionsUncheckedCreateInput): Promise<Transactions>
  update(data: UpdateTransactionRequest): Promise<Transactions>
  delete(id: string): Promise<void>
}
