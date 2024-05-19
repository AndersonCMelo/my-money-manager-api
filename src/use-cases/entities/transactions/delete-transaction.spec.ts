import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { DeleteTransactionUseCase } from './delete-transaction'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { InMemoryBankAccountsRepository } from '@/repositories/in-memory/in-memory-bank-accounts-repository'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { CreateTransactionUseCase } from './create-transaction'

let transactionsRepository: InMemoryTransactionsRepository
let bankAccountsRepository: InMemoryBankAccountsRepository
let sut: DeleteTransactionUseCase

let categoriesRepository: InMemoryCategoriesRepository
let createTransactionUseCase: CreateTransactionUseCase

describe('Delete Transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    sut = new DeleteTransactionUseCase(
      transactionsRepository,
      bankAccountsRepository,
    )

    categoriesRepository = new InMemoryCategoriesRepository()
    createTransactionUseCase = new CreateTransactionUseCase(
      transactionsRepository,
      categoriesRepository,
      bankAccountsRepository,
    )
  })

  it('should be able to delete a transaction', async () => {
    const createdTransaction = await transactionsRepository.create({
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

    await sut.execute({ id: createdTransaction.id })

    const transactions = await transactionsRepository.findMany()

    await expect(transactions).toEqual([])
  })

  it('should not be able to delete an inexistent transaction', async () => {
    await expect(() =>
      sut.execute({ id: 'transaction-02' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should to change the bank account balance when delete an expense transaction', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 500,
      accountBalance: 500,
      type: 'checking_account',
      ownerId: 'user-id',
    })

    const { transaction: createdTransaction } =
      await createTransactionUseCase.execute({
        description: 'Grocery',
        amount: 100,
        estabilishment: 'Ands Store',
        type: 'expense',
        essencial: true,
        date: '2024-04-29',
        categoryId: category.id,
        bankAccountId: bankAccount.id,
        destinationBankAccountId: null,
      })

    await sut.execute({ id: createdTransaction.id })

    const transactions = await transactionsRepository.findMany()

    expect(transactions).toEqual([])
    expect(bankAccount.accountBalance).toEqual(500)
  })

  it('should to change the bank account balance when delete an income transaction', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 500,
      accountBalance: 500,
      type: 'checking_account',
      ownerId: 'user-id',
    })

    const { transaction: createdTransaction } =
      await createTransactionUseCase.execute({
        description: 'Grocery',
        amount: 100,
        estabilishment: 'Ands Store',
        type: 'income',
        essencial: true,
        date: '2024-04-29',
        categoryId: category.id,
        bankAccountId: bankAccount.id,
        destinationBankAccountId: null,
      })

    await sut.execute({ id: createdTransaction.id })

    const transactions = await transactionsRepository.findMany()

    expect(transactions).toEqual([])
    expect(bankAccount.accountBalance).toEqual(500)
  })

  it('should to change the bank account balance when delete a transfer transaction', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 500,
      accountBalance: 500,
      type: 'checking_account',
      ownerId: 'user-id',
    })

    const destinationBankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Platinum Save Account',
      openingBalance: 0,
      accountBalance: 0,
      type: 'saving_account',
      ownerId: 'user-id',
    })

    const { transaction: createdTransaction } =
      await createTransactionUseCase.execute({
        description: 'Grocery',
        amount: 100,
        estabilishment: 'Ands Store',
        type: 'transfer',
        essencial: true,
        date: '2024-04-29',
        categoryId: category.id,
        bankAccountId: bankAccount.id,
        destinationBankAccountId: destinationBankAccount.id,
      })

    await sut.execute({ id: createdTransaction.id })

    const transactions = await transactionsRepository.findMany()

    expect(transactions).toEqual([])
    expect(bankAccount.accountBalance).toEqual(500)
    expect(destinationBankAccount.accountBalance).toEqual(0)
  })
})
