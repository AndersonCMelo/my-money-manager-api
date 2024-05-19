import { EstabilishmentsRepository } from '@/repositories/estabilishments-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface DeleteEstabilishmentUseCaseRequest {
  estabilishmentId: string
}

export class DeleteEstabilishmentUseCase {
  constructor(private estabilishmentsRepository: EstabilishmentsRepository) {}

  async execute({ estabilishmentId }: DeleteEstabilishmentUseCaseRequest) {
    const estabilishment =
      await this.estabilishmentsRepository.findById(estabilishmentId)

    if (!estabilishment) {
      throw new ResourceNotFoundError()
    }

    await this.estabilishmentsRepository.delete(estabilishmentId)
  }
}
