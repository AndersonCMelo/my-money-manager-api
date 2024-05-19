import { makeGetUserProfileUseCase } from '@/use-cases/factories/entities/users/make-get-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const getUserParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getUserParamsSchema.parse(request.params)

  const useCase = makeGetUserProfileUseCase()

  const { user } = await useCase.execute({ userId: id })

  return reply.status(200).send({
    user: {
      ...user,
      password: undefined,
    },
  })
}
