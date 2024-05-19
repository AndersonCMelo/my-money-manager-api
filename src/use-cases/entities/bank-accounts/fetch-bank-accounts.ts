import { BankAccountsRepository } from '@/repositories/bank-accounts-repository'

export class FetchBankAccountsUseCase {
  constructor(private bankAccountsRepository: BankAccountsRepository) {}

  async execute() {
    const bankAccounts = await this.bankAccountsRepository.findMany()

    return bankAccounts
  }
}
