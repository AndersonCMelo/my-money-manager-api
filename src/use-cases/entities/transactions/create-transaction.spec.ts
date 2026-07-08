import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { CreateTransactionUseCase } from './create-transaction'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryBankAccountsRepository } from '@/repositories/in-memory/in-memory-bank-accounts-repository'
import { InMemoryCreditCardsRepository } from '@/repositories/in-memory/in-memory-credit-cards-repository'

let transactionsRepository: InMemoryTransactionsRepository
let categoriesRepository: InMemoryCategoriesRepository
let bankAccountsRepository: InMemoryBankAccountsRepository
let creditCardsRepository: InMemoryCreditCardsRepository
let sut: CreateTransactionUseCase

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    creditCardsRepository = new InMemoryCreditCardsRepository()
    sut = new CreateTransactionUseCase(
      transactionsRepository,
      categoriesRepository,
      bankAccountsRepository,
      creditCardsRepository,
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
      creditCardId: null,
      totalInstallments: null,
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
        creditCardId: null,
        totalInstallments: null,
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
        creditCardId: null,
        totalInstallments: null,
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
      creditCardId: null,
      totalInstallments: null,
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
        creditCardId: null,
        totalInstallments: null,
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
        creditCardId: null,
        totalInstallments: null,
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
      creditCardId: null,
      totalInstallments: null,
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
      creditCardId: null,
      totalInstallments: null,
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
      creditCardId: null,
      totalInstallments: null,
    })

    expect(transaction.id).toEqual(expect.any(String))
    expect(bankAccount.accountBalance).toEqual(400)
    expect(destinationBankAccount.accountBalance).toEqual(100)
  })

  it('should store the purchase date as-is for the first installment and roll subsequent installments forward month by month', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const creditCard = await creditCardsRepository.create({
      name: 'My Card',
      limit: 1000,
      closingDay: 25,
      dueDay: 5,
      ownerId: 'user-id',
    })

    const { transaction, installments } = await sut.execute({
      description: 'New TV',
      amount: 300,
      estabilishment: 'Electronics Store',
      type: 'credit_expense',
      essencial: false,
      date: '2024-05-28',
      categoryId: category.id,
      bankAccountId: null,
      destinationBankAccountId: null,
      creditCardId: creditCard.id,
      totalInstallments: 3,
    })

    expect(transaction.date).toEqual('2024-05-28')
    expect(installments).toHaveLength(3)
    expect(installments?.map((i) => i.date)).toEqual([
      '2024-05-28',
      '2024-06-28',
      '2024-07-28',
    ])
  })

  it('should be able to pay the correct installments for the billing month, honoring the closing day rollover', async () => {
    const category = await categoriesRepository.create({
      category: 'category-01',
      color: '#00F0F0',
      order: 0,
    })

    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 1000,
      accountBalance: 1000,
      type: 'checking_account',
      ownerId: 'user-id',
    })

    const creditCard = await creditCardsRepository.create({
      name: 'My Card',
      limit: 1000,
      closingDay: 25,
      dueDay: 5,
      ownerId: 'user-id',
    })

    // Purchased after the closing day (25) -> falls into June's bill, not May's.
    await sut.execute({
      description: 'New TV',
      amount: 300,
      estabilishment: 'Electronics Store',
      type: 'credit_expense',
      essencial: false,
      date: '2024-05-28',
      categoryId: category.id,
      bankAccountId: null,
      destinationBankAccountId: null,
      creditCardId: creditCard.id,
      totalInstallments: 1,
    })

    const { transaction: payment } = await sut.execute({
      description: 'Card bill payment',
      amount: 0,
      estabilishment: null,
      type: 'credit_payment',
      essencial: true,
      date: '2024-06-05',
      categoryId: category.id,
      bankAccountId: bankAccount.id,
      destinationBankAccountId: null,
      creditCardId: creditCard.id,
      totalInstallments: null,
    })

    expect(payment.amount).toEqual(300)
    expect(bankAccount.accountBalance).toEqual(700)

    const pendingInstallments = await transactionsRepository.findByCreditCard(
      creditCard.id,
    )

    expect(pendingInstallments.every((i) => i.isPaid)).toBe(true)
  })
})
