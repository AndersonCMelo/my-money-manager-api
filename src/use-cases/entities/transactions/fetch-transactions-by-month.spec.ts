import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { FetchTransactionsByMonthUseCase } from './fetch-transactions-by-month'

let transactionsRepository: InMemoryTransactionsRepository
let sut: FetchTransactionsByMonthUseCase

describe('Fetch Transactions By Month Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new FetchTransactionsByMonthUseCase(transactionsRepository)
  })

  it('should be able to fetch transactions by month', async () => {
    await transactionsRepository.create({
      description: 'Grocery',
      amount: 100,
      estabilishment: 'Ands Store',
      type: 'expense',
      essencial: true,
      date: '2024-04-29',
      categoryId: 'category-01',
      bankAccountId: 'bankAccount-id',
      destinationBankAccountId: null,
    })

    await transactionsRepository.create({
      description: 'Gasoline',
      amount: 50,
      estabilishment: 'Gas station',
      type: 'expense',
      essencial: true,
      date: '2024-05-14',
      categoryId: 'category-02',
      bankAccountId: 'bankAccount-id',
      destinationBankAccountId: null,
    })

    await transactionsRepository.create({
      description: 'Energy bill',
      amount: 30,
      estabilishment: 'Energy company',
      type: 'expense',
      essencial: true,
      date: '2024-05-15',
      categoryId: 'category-03',
      bankAccountId: 'bankAccount-id',
      destinationBankAccountId: null,
    })

    const transactions = await sut.execute({ month: '2024-05' })

    expect(transactions).toEqual([
      expect.objectContaining({ description: 'Gasoline', amount: 50 }),
      expect.objectContaining({ description: 'Energy bill', amount: 30 }),
    ])
  })
})
