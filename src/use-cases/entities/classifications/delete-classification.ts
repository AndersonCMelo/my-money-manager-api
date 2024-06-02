import { ClassificationsRepository } from '@/repositories/classifications-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface DeleteClassificationUseCaseRequest {
  classificationId: string
}

export class DeleteClassificationUseCase {
  constructor(private classificationsRepository: ClassificationsRepository) {}

  async execute({ classificationId }: DeleteClassificationUseCaseRequest) {
    const classification =
      await this.classificationsRepository.findById(classificationId)

    if (!classification) {
      throw new ResourceNotFoundError()
    }

    await this.classificationsRepository.delete(classificationId)
  }
}
