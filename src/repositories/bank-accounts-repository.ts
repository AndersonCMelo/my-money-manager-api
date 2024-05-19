import { Prisma, BankAccounts } from '@prisma/client'

export interface UpdateBalanceProps {
  id: string
  accountBalance: number
}

export interface BankAccountsRepository {
  findById(id: string): Promise<BankAccounts | null>
  findMany(): Promise<BankAccounts[] | null>
  create(data: Prisma.BankAccountsUncheckedCreateInput): Promise<BankAccounts>
  update(data: Prisma.BankAccountsUncheckedCreateInput): Promise<BankAccounts>
  updateBalance(data: UpdateBalanceProps): Promise<BankAccounts>
  delete(id: string): Promise<void>
}
