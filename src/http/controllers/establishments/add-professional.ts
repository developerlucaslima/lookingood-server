import { EstablishmentNotFoundError } from '@/use-cases/errors/establishment-not-found-error'
import { makeAddProfessionalUseCase } from '@/use-cases/factories/make-add-professional-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function addProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, imageUrl } = z
    .object({
      name: z.string(),
      imageUrl: z.string().nullable(),
    })
    .parse(request.body)

  try {
    const addProfessionalUseCase = makeAddProfessionalUseCase()

    await addProfessionalUseCase.execute({
      name,
      imageUrl,
      establishmentId: request.user.sub,
    })
  } catch (err) {
    if (err instanceof EstablishmentNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
