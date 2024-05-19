import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { FetchTransactionsUseCase } from './fetch-transactions'

let transactionsRepository: InMemoryTransactionsRepository
let sut: FetchTransactionsUseCase

describe('Fetch Transactions Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new FetchTransactionsUseCase(transactionsRepository)
  })

  it('should be able to fetch all transactions', async () => {
    await transactionsRepository.create({
      description: 'Grocery',
      amount: 100,
      estabilishment: 'Ands Store',
      type: 'expense',
      essencial: true,
      date: '2024-05-15',
      categoryId: 'category-01',
      bankAccountId: 'bankAccount-id',
      destinationBankAccountId: null,
    })

    await transactionsRepository.create({
      description: 'Gas',
      amount: 50,
      estabilishment: 'Gas station',
      type: 'expense',
      essencial: true,
      date: '2024-05-15',
      categoryId: 'category-02',
      bankAccountId: 'bankAccount-id',
      destinationBankAccountId: null,
    })

    const transactions = await sut.execute()

    expect(transactions).toEqual([
      expect.objectContaining({ description: 'Grocery', amount: 100 }),
      expect.objectContaining({ description: 'Gas', amount: 50 }),
    ])
  })
})
