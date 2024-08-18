import { FastifyReply, FastifyRequest } from 'fastify'

import { userProfileFactory } from '@/use-cases/factories/user-profile-factory'

export async function userProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userProfileUseCase = userProfileFactory()

  const { user } = await userProfileUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      passwordHash: undefined,
    },
  })
}
