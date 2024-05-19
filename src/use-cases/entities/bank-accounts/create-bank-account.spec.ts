import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBankAccountsRepository } from '@/repositories/in-memory/in-memory-bank-accounts-repository'
import { CreateBankAccountsUseCase } from './create-bank-account'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let bankAccountsRepository: InMemoryBankAccountsRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateBankAccountsUseCase

describe('Create BankAccounts Use Case', () => {
  beforeEach(() => {
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateBankAccountsUseCase(bankAccountsRepository, usersRepository)
  })

  it('should be able to create a bank account', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    const { bankAccount } = await sut.execute({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 0,
      accountBalance: 0,
      type: 'checking_account',
      ownerId: user.id,
    })

    expect(bankAccount.id).toEqual(expect.any(String))
  })

  it('should not be able to create a bank account if owner does not exist', async () => {
    await expect(() =>
      sut.execute({
        bankName: 'Premium Bank',
        accountLabel: 'Premium Bank - Anderson',
        openingBalance: 0,
        accountBalance: 0,
        type: 'checking_account',
        ownerId: 'user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
