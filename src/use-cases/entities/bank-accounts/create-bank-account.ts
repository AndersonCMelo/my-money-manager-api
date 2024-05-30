import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { BankAccounts } from '@prisma/client'

interface CreateBankAccountsUseCaseRequest {
  bankName: string
  accountLabel: string | null
  openingBalance: number | null
  accountBalance: number
  type: string | null
  ownerId: string
}

interface CreateBankAccountsUseCaseResponse {
  bankAccount: BankAccounts
}

export class CreateBankAccountsUseCase {
  constructor(
    private bankAccountsRepository: BankAccountsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    accountBalance,
    accountLabel,
    bankName,
    openingBalance,
    ownerId,
    type,
  }: CreateBankAccountsUseCaseRequest): Promise<CreateBankAccountsUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const bankAccount = await this.bankAccountsRepository.create({
      bankName,
      accountLabel: accountLabel ?? bankName,
      openingBalance: openingBalance ?? accountBalance,
      accountBalance,
      type,
      ownerId: user.id,
    })

    return { bankAccount }
  }
}
