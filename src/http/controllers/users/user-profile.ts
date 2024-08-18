import { FastifyReply, FastifyRequest } from 'fastify'

import { makeUserProfileUseCase } from '@/use-cases/factories/make-user-profile-use-case'

export async function userProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userProfileUseCase = makeUserProfileUseCase()

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
