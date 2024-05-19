import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { BankAccounts } from '@prisma/client'

interface UpdateBankAccountUseCaseRequest {
  id: string
  bankName: string
  accountLabel: string | null
  openingBalance: number
  accountBalance: number
  type: string | null
  ownerId: string
}

interface UpdateBankAccountUseCaseResponse {
  bankAccounts: BankAccounts
}

export class UpdateBankAccountUseCase {
  constructor(
    private bankAccountsRepository: BankAccountsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    id,
    accountBalance,
    accountLabel,
    bankName,
    openingBalance,
    ownerId,
    type,
  }: UpdateBankAccountUseCaseRequest): Promise<UpdateBankAccountUseCaseResponse> {
    const existentBankAccounts = await this.bankAccountsRepository.findById(id)

    if (!existentBankAccounts) {
      throw new ResourceNotFoundError()
    }

    const user = await this.usersRepository.findById(ownerId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const bankAccounts = await this.bankAccountsRepository.update({
      id,
      accountBalance,
      accountLabel,
      bankName,
      openingBalance,
      ownerId,
      type,
    })

    return { bankAccounts }
  }
}
