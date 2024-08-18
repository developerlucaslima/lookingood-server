import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { makeAddServiceUseCase } from '@/use-cases/factories/make-add-service-use-case'

export async function addServiceController(
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
      genderFor: z.enum(['MALE', 'FEMALE', 'BOTH']),
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
    if (err instanceof EstablishmentNotFoundException) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
