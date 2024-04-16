import { makeGetEstablishmentProfileUseCase } from '@/use-cases/factories/make-get-establishment-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function establishmentProfile(
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
