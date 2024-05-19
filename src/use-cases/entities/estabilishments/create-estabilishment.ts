import { EstabilishmentsRepository } from '@/repositories/estabilishments-repository'
import { Estabilishments } from '@prisma/client'

interface CreateEstabilishmentUseCaseRequest {
  estabilishment: string
}

interface CreateEstabilishmentUseCaseResponse {
  estabilishment: Estabilishments
}

export class CreateEstabilishmentUseCase {
  constructor(private establishmentsRepository: EstabilishmentsRepository) {}

  async execute({
    estabilishment,
  }: CreateEstabilishmentUseCaseRequest): Promise<CreateEstabilishmentUseCaseResponse> {
    const createdEstabilishment = await this.establishmentsRepository.create({
      estabilishment,
    })

    return { estabilishment: createdEstabilishment }
  }
}
