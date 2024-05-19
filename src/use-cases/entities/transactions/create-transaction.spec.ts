import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { CreateTransactionUseCase } from './create-transaction'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryBankAccountsRepository } from '@/repositories/in-memory/in-memory-bank-accounts-repository'

let transactionsRepository: InMemoryTransactionsRepository
let categoriesRepository: InMemoryCategoriesRepository
let bankAccountsRepository: InMemoryBankAccountsRepository
let sut: CreateTransactionUseCase

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    sut = new CreateTransactionUseCase(
      transactionsRepository,
      categoriesRepository,
      bankAccountsRepository,
    )
  })

  it('should be able to create a transaction', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 0,
      accountBalance: 0,
      type: 'checking_account',
      ownerId: 'user-id',
    })

    const { transaction } = await sut.execute({
      description: 'My transaction',
      amount: 100,
      estabilishment: 'Ands Store',
      type: 'expense',
      essencial: true,
      date: '2024-05-15',
      categoryId: category.id,
      bankAccountId: bankAccount.id,
      destinationBankAccountId: null,
    })

    expect(transaction.id).toEqual(expect.any(String))
  })

  it('should not be able to create a transaction if category does not exist', async () => {
    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 0,
      accountBalance: 0,
      type: 'checking_account',
      ownerId: 'user-id',
    })

    await expect(() =>
      sut.execute({
        description: 'My transaction',
        amount: 100,
        estabilishment: 'Ands Store',
        type: 'expense',
        essencial: true,
        date: '2024-05-15',
        categoryId: 'category.id',
        bankAccountId: bankAccount.id,
        destinationBankAccountId: null,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to create a transaction if bank account does not exist', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    await expect(() =>
      sut.execute({
        description: 'My transaction',
        amount: 100,
        estabilishment: 'Ands Store',
        type: 'expense',
        essencial: true,
        date: '2024-05-15',
        categoryId: category.id,
        bankAccountId: 'bankAccount.id',
        destinationBankAccountId: null,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to create a transfer transaction', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 100,
      accountBalance: 0,
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

    const { transaction } = await sut.execute({
      description: 'My transaction',
      amount: 100,
      estabilishment: 'Ands Store',
      type: 'transfer',
      essencial: true,
      date: '2024-05-15',
      categoryId: category.id,
      bankAccountId: bankAccount.id,
      destinationBankAccountId: destinationBankAccount.id,
    })

    expect(transaction.id).toEqual(expect.any(String))
  })

  it('should not be able to create a transfer transaction without a destination bank account', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 0,
      accountBalance: 0,
      type: 'checking_account',
      ownerId: 'user-id',
    })

    await expect(() =>
      sut.execute({
        description: 'My transaction',
        amount: 100,
        estabilishment: 'Ands Store',
        type: 'transfer',
        essencial: true,
        date: '2024-05-15',
        categoryId: category.id,
        bankAccountId: bankAccount.id,
        destinationBankAccountId: null,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to create a transfer transaction if destination bank account does not exist', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 0,
      accountBalance: 0,
      type: 'checking_account',
      ownerId: 'user-id',
    })

    await expect(() =>
      sut.execute({
        description: 'My transaction',
        amount: 100,
        estabilishment: 'Ands Store',
        type: 'transfer',
        essencial: true,
        date: '2024-05-15',
        categoryId: category.id,
        bankAccountId: bankAccount.id,
        destinationBankAccountId: 'some-bank-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should to change the bank account balance when create an expense transaction', async () => {
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

    const { transaction } = await sut.execute({
      description: 'My transaction',
      amount: 100,
      estabilishment: 'Ands Store',
      type: 'expense',
      essencial: true,
      date: '2024-05-15',
      categoryId: category.id,
      bankAccountId: bankAccount.id,
      destinationBankAccountId: null,
    })

    expect(transaction.id).toEqual(expect.any(String))
    expect(bankAccount.accountBalance).toEqual(400)
  })

  it('should to change the bank account balance when create an income transaction', async () => {
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

    const { transaction } = await sut.execute({
      description: 'My transaction',
      amount: 100,
      estabilishment: 'Ands Store',
      type: 'income',
      essencial: true,
      date: '2024-05-15',
      categoryId: category.id,
      bankAccountId: bankAccount.id,
      destinationBankAccountId: null,
    })

    expect(transaction.id).toEqual(expect.any(String))
    expect(bankAccount.accountBalance).toEqual(600)
  })

  it('should to change the bank account balance when create a transfer transaction', async () => {
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

    const { transaction } = await sut.execute({
      description: 'My transaction',
      amount: 100,
      estabilishment: 'Ands Store',
      type: 'transfer',
      essencial: true,
      date: '2024-05-15',
      categoryId: category.id,
      bankAccountId: bankAccount.id,
      destinationBankAccountId: destinationBankAccount.id,
    })

    expect(transaction.id).toEqual(expect.any(String))
    expect(bankAccount.accountBalance).toEqual(400)
    expect(destinationBankAccount.accountBalance).toEqual(100)
  })
})
