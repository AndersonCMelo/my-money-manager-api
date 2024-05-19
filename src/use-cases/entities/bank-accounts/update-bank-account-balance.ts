import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { BankAccounts } from '@prisma/client'

interface UpdateBankAccountBalanceUseCaseRequest {
  id: string
  accountBalance: number
}

interface UpdateBankAccountBalanceUseCaseResponse {
  bankAccounts: BankAccounts
}

export class UpdateBankAccountBalanceUseCase {
  constructor(private bankAccountsRepository: BankAccountsRepository) {}

  async execute({
    id,
    accountBalance,
  }: UpdateBankAccountBalanceUseCaseRequest): Promise<UpdateBankAccountBalanceUseCaseResponse> {
    const existentBankAccounts = await this.bankAccountsRepository.findById(id)

    if (!existentBankAccounts) {
      throw new ResourceNotFoundError()
    }

    const bankAccounts = await this.bankAccountsRepository.updateBalance({
      id,
      accountBalance,
    })

    return { bankAccounts }
  }
}
