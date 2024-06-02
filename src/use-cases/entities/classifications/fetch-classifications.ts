import { ClassificationsRepository } from '@/repositories/classifications-repository'

export class FetchClassificationsUseCase {
  constructor(private classificationsRepository: ClassificationsRepository) {}

  async execute() {
    const classifications = await this.classificationsRepository.findMany()

    return classifications
  }
}
