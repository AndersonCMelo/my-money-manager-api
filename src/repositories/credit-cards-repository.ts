import { Prisma, CreditCards } from '@prisma/client'

export interface UpdateCreditCardProps {
  id: string
  name: string
  limit: number
  closingDay: number
  dueDay: number
  color?: string | null
}

export interface CreditCardsRepository {
  findById(id: string): Promise<CreditCards | null>
  findMany(): Promise<CreditCards[]>
  create(data: Prisma.CreditCardsUncheckedCreateInput): Promise<CreditCards>
  update(data: UpdateCreditCardProps): Promise<CreditCards>
  delete(id: string): Promise<void>
}
