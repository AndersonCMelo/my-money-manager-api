import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBankAccountsRepository } from '@/repositories/in-memory/in-memory-bank-accounts-repository'
import { UpdateBankAccountBalanceUseCase } from './update-bank-account-balance'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let bankAccountsRepository: InMemoryBankAccountsRepository
let usersRepository: InMemoryUsersRepository
let sut: UpdateBankAccountBalanceUseCase

describe('Update Bank Account Use Case', () => {
  beforeEach(() => {
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateBankAccountBalanceUseCase(bankAccountsRepository)
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
      accountBalance: 100,
    })

    expect(bankAccount).toEqual(
      expect.objectContaining({ accountBalance: 100 }),
    )
  })

  it('should not be able to update inexistent bankAccounts', async () => {
    await expect(() =>
      sut.execute({
        id: 'bankAccounts-01',
        accountBalance: 100,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
