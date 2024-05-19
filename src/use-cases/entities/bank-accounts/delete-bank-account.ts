import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface DeleteBankAccountUseCaseRequest {
  id: string
}

export class DeleteBankAccountUseCase {
  constructor(private bankAccountsRepository: BankAccountsRepository) {}

  async execute({ id }: DeleteBankAccountUseCaseRequest) {
    const bankAccount = await this.bankAccountsRepository.findById(id)

    if (!bankAccount) {
      throw new ResourceNotFoundError()
    }

    await this.bankAccountsRepository.delete(id)
  }
}
