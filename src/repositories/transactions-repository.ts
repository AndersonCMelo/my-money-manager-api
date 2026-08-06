import { Prisma, Transactions } from '@prisma/client'

export interface UpdateTransactionRequest {
  id: string
  description: string | null
  estabilishment: string | null
  essencial: boolean
  date: string
  categoryId: string
}

export interface FindDuplicateTransactionRequest {
  type: Transactions['type']
  amount: number
  date: string
  categoryId: string
  estabilishment: string
  bankAccountId: string | null
  creditCardId: string | null
}

export interface TransactionsRepository {
  findById(id: string): Promise<Transactions | null>
  findByMonth(month: string): Promise<Transactions[]>
  findMany(): Promise<Transactions[]>
  findByCreditCard(creditCardId: string): Promise<Transactions[]>
  findDuplicate(
    data: FindDuplicateTransactionRequest,
  ): Promise<Transactions | null>
  create(data: Prisma.TransactionsUncheckedCreateInput): Promise<Transactions>
  update(data: UpdateTransactionRequest): Promise<Transactions>
  delete(id: string): Promise<void>
  deleteByGroup(installmentGroupId: string): Promise<void>
  setPaidStatus(ids: string[], isPaid: boolean): Promise<void>
}
