import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetEstablishmentProfileUseCase } from '@/use-cases/factories/make-get-establishment-profile-use-case'

export async function establishmentProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getEstablishmentProfile = makeGetEstablishmentProfileUseCase()

  const { establishment } = await getEstablishmentProfile.execute({
    establishmentId: request.user.sub,
  })

  return reply.status(200).send({
    establishment: {
      ...establishment,
      passwordHash: undefined,
    },
  })
}
