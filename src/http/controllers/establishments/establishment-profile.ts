import { FastifyReply, FastifyRequest } from 'fastify'

import { makeEstablishmentProfileUseCase } from '@/use-cases/factories/make-establishment-profile-use-case'

export async function establishmentProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const establishmentProfileUseCase = makeEstablishmentProfileUseCase()

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
