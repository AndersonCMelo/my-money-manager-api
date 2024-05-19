import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBankAccountsRepository } from '@/repositories/in-memory/in-memory-bank-accounts-repository'
import { DeleteBankAccountUseCase } from './delete-bank-account'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let bankAccountsRepository: InMemoryBankAccountsRepository
let sut: DeleteBankAccountUseCase

describe('Delete BankAccount Use Case', () => {
  beforeEach(() => {
    bankAccountsRepository = new InMemoryBankAccountsRepository()
    sut = new DeleteBankAccountUseCase(bankAccountsRepository)
  })

  it('should be able to delete a bank account', async () => {
    const createdBankAccount = await bankAccountsRepository.create({
      bankName: 'Premium Bank',
      accountLabel: 'Premium Bank - Anderson',
      openingBalance: 0,
      accountBalance: 0,
      type: 'checking_account',
      ownerId: 'user-id',
    })

    await sut.execute({ id: createdBankAccount.id })

    const bankAccounts = await bankAccountsRepository.findMany()

    await expect(bankAccounts).toEqual([])
  })

  it('should not be able to delete an inexistent bank account', async () => {
    await expect(() =>
      sut.execute({ id: 'bankAccount-02' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
