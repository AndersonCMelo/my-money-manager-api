import { EstabilishmentsRepository } from '@/repositories/estabilishments-repository'

export class FetchEstabilishmentsUseCase {
  constructor(private estabilishmentsRepository: EstabilishmentsRepository) {}

  async execute() {
    const estabilishments = await this.estabilishmentsRepository.findMany()

    return estabilishments
  }
}
