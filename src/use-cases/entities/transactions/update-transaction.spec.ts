import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { UpdateTransactionUseCase } from './update-transaction'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'

let transactionsRepository: InMemoryTransactionsRepository
let categoriesRepository: InMemoryCategoriesRepository
let sut: UpdateTransactionUseCase

describe('Update Transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new UpdateTransactionUseCase(
      transactionsRepository,
      categoriesRepository,
    )
  })

  it('should be able to update transactions', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const transaction = await transactionsRepository.create({
      description: 'Grocery',
      amount: 100,
      estabilishment: 'Ands Store',
      type: 'expense',
      essencial: true,
      date: '2024-04-29',
      categoryId: category.id,
      bankAccountId: 'bankAccount.id',
      destinationBankAccountId: null,
    })

    await sut.execute({
      id: transaction.id,
      description: 'Grocery edited',
      estabilishment: 'Ands Store',
      essencial: true,
      date: '2024-04-29',
      categoryId: category.id,
    })

    expect(transaction).toEqual(
      expect.objectContaining({ description: 'Grocery edited' }),
    )
  })

  it('should not be able to update inexistent transactions', async () => {
    await expect(() =>
      sut.execute({
        id: 'transactions-01',
        description: 'Grocery edited',
        estabilishment: 'Ands Store',
        essencial: true,
        date: '2024-04-29',
        categoryId: 'category.id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
