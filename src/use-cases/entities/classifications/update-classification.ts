import { ClassificationsRepository } from '@/repositories/classifications-repository'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { Classification } from '@prisma/client'

interface UpdateClassificationUseCaseRequest {
  id: string
  name: string
  color: string
  // order: number
}

interface UpdateClassificationUseCaseResponse {
  classification: Classification
}

export class UpdateClassificationUseCase {
  constructor(private classificationsRepository: ClassificationsRepository) {}

  async execute({
    id,
    name,
    color,
    // order,
  }: UpdateClassificationUseCaseRequest): Promise<UpdateClassificationUseCaseResponse> {
    const existentClassification =
      await this.classificationsRepository.findById(id)

    if (!existentClassification) {
      throw new ResourceNotFoundError()
    }

    const classificationWithSameName =
      await this.classificationsRepository.findByClassificationName(name)

    if (classificationWithSameName && classificationWithSameName.id !== id) {
      throw new CategoryAlreadyExistsError()
    }

    const updatedClassification = await this.classificationsRepository.update({
      id,
      name,
      color,
    })

    return { classification: updatedClassification }
  }
}
