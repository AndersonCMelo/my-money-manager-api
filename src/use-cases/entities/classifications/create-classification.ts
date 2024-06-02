import { ClassificationsRepository } from '@/repositories/classifications-repository'
import { Classification } from '@prisma/client'
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error'
import { CategoryOrderAlreadyExistsError } from '@/use-cases/errors/category-order-already-exists-error'

interface CreateClassificationUseCaseRequest {
  name: string
  color: string
  order: number
}

interface CreateClassificationUseCaseResponse {
  classification: Classification
}

export class CreateClassificationUseCase {
  constructor(private classificationsRepository: ClassificationsRepository) {}

  async execute({
    name,
    color,
    order,
  }: CreateClassificationUseCaseRequest): Promise<CreateClassificationUseCaseResponse> {
    const classificationWithSameName =
      await this.classificationsRepository.findByClassificationName(name)

    if (classificationWithSameName) {
      throw new CategoryAlreadyExistsError()
    }

    const classificationWithSameOrder =
      await this.classificationsRepository.findByOrder(order)

    if (classificationWithSameOrder) {
      throw new CategoryOrderAlreadyExistsError()
    }

    const createdClassification = await this.classificationsRepository.create({
      name,
      color,
      order,
    })

    return { classification: createdClassification }
  }
}
