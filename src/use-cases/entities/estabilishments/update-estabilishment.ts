import { EstabilishmentsRepository } from '@/repositories/estabilishments-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { Estabilishments } from '@prisma/client'

interface UpdateEstabilishmentUseCaseRequest {
  id: string
  estabilishment: string
}

interface UpdateEstabilishmentUseCaseResponse {
  estabilishment: Estabilishments
}

export class UpdateEstabilishmentUseCase {
  constructor(private estabilishmentsRepository: EstabilishmentsRepository) {}

  async execute({
    id,
    estabilishment,
  }: UpdateEstabilishmentUseCaseRequest): Promise<UpdateEstabilishmentUseCaseResponse> {
    const existentEstabilishment =
      await this.estabilishmentsRepository.findById(id)

    if (!existentEstabilishment) {
      throw new ResourceNotFoundError()
    }

    const updatedEstabilishment = await this.estabilishmentsRepository.update({
      id,
      estabilishment,
    })

    return { estabilishment: updatedEstabilishment }
  }
}
