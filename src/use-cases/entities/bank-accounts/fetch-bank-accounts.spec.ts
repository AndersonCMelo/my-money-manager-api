import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBankAccountsRepository } from '@/repositories/in-memory/in-memory-bank-accounts-repository'
import { FetchBankAccountsUseCase } from './fetch-bank-accounts'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let bankAccountsRepository: InMemoryBankAccountsRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchBankAccountsUseCase

describe('Fetch Bank Accounts Use Case', () => {
  beforeEach(() => {
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchBankAccountsUseCase(bankAccountsRepository)
  })

  it('should be able to get bank accounts', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 0,
      accountBalance: 0,
      type: 'checking_account',
      ownerId: user.id,
    })

    await bankAccountsRepository.create({
      bankName: 'Standard Bank',
      accountLabel: 'Standard Bank - Anderson',
      openingBalance: 10000,
      accountBalance: 10000,
      type: 'checking_account',
      ownerId: user.id,
    })

    const bankAccounts = await sut.execute()

    expect(bankAccounts).toEqual([
      expect.objectContaining({ accountLabel: 'Premium Bank - Anderson' }),
      expect.objectContaining({ accountLabel: 'Standard Bank - Anderson' }),
    ])
  })
})
