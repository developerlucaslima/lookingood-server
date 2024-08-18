import { FastifyReply, FastifyRequest } from 'fastify'

import { establishmentProfileFactory } from '@/use-cases/factories/establishment-profile-factory'

export async function establishmentProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const establishmentProfileUseCase = establishmentProfileFactory()

  const { establishment } = await establishmentProfileUseCase.execute({
    establishmentId: request.user.sub,
  })

  return reply.status(200).send({
    establishment: {
      ...establishment,
      passwordHash: undefined,
    },
  })
}
