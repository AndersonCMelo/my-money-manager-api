import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBankAccountsRepository } from '@/repositories/in-memory/in-memory-bank-accounts-repository'
import { UpdateBankAccountUseCase } from './update-bank-account'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let bankAccountsRepository: InMemoryBankAccountsRepository
let usersRepository: InMemoryUsersRepository
let sut: UpdateBankAccountUseCase

describe('Update Bank Account Use Case', () => {
  beforeEach(() => {
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateBankAccountUseCase(bankAccountsRepository, usersRepository)
  })

  it('should be able to update bankAccounts', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    const bankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 0,
      accountBalance: 0,
      type: 'checking_account',
      ownerId: user.id,
    })

    await sut.execute({
      id: bankAccount.id,
      bankName: 'Standard Bank',
      accountLabel: 'Standard Bank - Anderson',
      openingBalance: 0,
      accountBalance: 100,
      type: 'checking_account',
      ownerId: user.id,
    })

    expect(bankAccount).toEqual(
      expect.objectContaining({
        accountLabel: 'Standard Bank - Anderson',
        accountBalance: 100,
      }),
    )
  })

  it('should not be able to update inexistent bankAccounts', async () => {
    await expect(() =>
      sut.execute({
        id: 'bankAccounts-01',
        bankName: 'Standard Bank',
        accountLabel: 'Standard Bank - Anderson',
        openingBalance: 0,
        accountBalance: 0,
        type: 'checking_account',
        ownerId: 'user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
