import { makeFetchSettingsUseCase } from '@/use-cases/factories/entities/settings/make-fetch-settings-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeFetchSettingsUseCase()

  const settings = await useCase.execute()

  return reply.status(200).send(settings ? settings[0] : null)
}
