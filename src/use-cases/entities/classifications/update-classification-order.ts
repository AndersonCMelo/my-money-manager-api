import { ClassificationsRepository } from '@/repositories/classifications-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface UpdateClassificationUseCaseRequest {
  id: string
  order: number
}

export class UpdateClassificationOrderUseCase {
  constructor(private classificationsRepository: ClassificationsRepository) {}

  async existentClassification(id: string) {
    await this.classificationsRepository.findById(id)
  }

  async execute({ id, order }: UpdateClassificationUseCaseRequest) {
    const existentClassification =
      await this.classificationsRepository.findById(id)

    if (!existentClassification) {
      throw new ResourceNotFoundError()
    }

    await this.classificationsRepository.updateOrder({
      id,
      order,
    })
  }
}
