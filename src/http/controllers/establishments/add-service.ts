import { EstablishmentNotFoundError } from '@/use-cases/errors/establishment-not-found-error'
import { makeAddServiceUseCase } from '@/use-cases/factories/make-add-service-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function addProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {
    name,
    price,
    genderFor,
    description,
    imageUrl,
    modificationDeadlineMinutes,
    durationMinutes,
  } = z
    .object({
      name: z.string(),
      price: z.number().positive(),
      genderFor: z.enum(['Male', 'Female', 'Both']),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
      modificationDeadlineMinutes: z.number().positive(),
      durationMinutes: z.number().positive(),
    })
    .parse(request.body)

  try {
    const addServiceUseCase = makeAddServiceUseCase()

    await addServiceUseCase.execute({
      name,
      price,
      genderFor,
      description,
      imageUrl,
      modificationDeadlineMinutes,
      establishmentId: request.user.sub,
      durationMinutes,
    })
  } catch (err) {
    if (err instanceof EstablishmentNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
