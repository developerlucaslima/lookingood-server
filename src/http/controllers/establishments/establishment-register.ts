import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EmailNotAvailableException } from '@/errors/email-not-available.exception.ts'
import { makeEstablishmentRegisterUseCase } from '@/use-cases/factories/make-establishment-register-use-case'

export async function establishmentRegisterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {
    name,
    description,
    phone,
    imageUrl,
    email,
    password,
    latitude,
    longitude,
  } = z
    .object({
      name: z.string(),
      description: z.string().nullable(),
      phone: z.string().nullable(),
      imageUrl: z.string().nullable(),
      email: z.string().email(),
      password: z.string().min(6),
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })
    .parse(request.body)

  try {
    const establishmentRegisterUseCase = makeEstablishmentRegisterUseCase()

    await establishmentRegisterUseCase.execute({
      name,
      description,
      phone,
      imageUrl,
      email,
      password,
      latitude,
      longitude,
    })
  } catch (err) {
    if (err instanceof EmailNotAvailableException) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
