import { EstablishmentNotFoundError } from '@/use-cases/errors/establishment-not-found-error'
import { makeAddScheduleUseCase } from '@/use-cases/factories/make-add-schedule-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function addProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  const invalidTime = 'Invalid time'

  const {
    monOpeningTime,
    tueOpeningTime,
    wedOpeningTime,
    thuOpeningTime,
    friOpeningTime,
    satOpeningTime,
    sunOpeningTime,
    monClosingTime,
    tueClosingTime,
    wedClosingTime,
    thuClosingTime,
    friClosingTime,
    satClosingTime,
    sunClosingTime,
  } = z
    .object({
      monOpeningTime: z.string().regex(timeRegex, { message: invalidTime }),
      tueOpeningTime: z.string().regex(timeRegex, { message: invalidTime }),
      wedOpeningTime: z.string().regex(timeRegex, { message: invalidTime }),
      thuOpeningTime: z.string().regex(timeRegex, { message: invalidTime }),
      friOpeningTime: z.string().regex(timeRegex, { message: invalidTime }),
      satOpeningTime: z.string().regex(timeRegex, { message: invalidTime }),
      sunOpeningTime: z.string().regex(timeRegex, { message: invalidTime }),
      monClosingTime: z.string().regex(timeRegex, { message: invalidTime }),
      tueClosingTime: z.string().regex(timeRegex, { message: invalidTime }),
      wedClosingTime: z.string().regex(timeRegex, { message: invalidTime }),
      thuClosingTime: z.string().regex(timeRegex, { message: invalidTime }),
      friClosingTime: z.string().regex(timeRegex, { message: invalidTime }),
      satClosingTime: z.string().regex(timeRegex, { message: invalidTime }),
      sunClosingTime: z.string().regex(timeRegex, { message: invalidTime }),
    })
    .parse(request.body)

  try {
    const addScheduleUseCase = makeAddScheduleUseCase()

    await addScheduleUseCase.execute({
      monOpeningTime,
      tueOpeningTime,
      wedOpeningTime,
      thuOpeningTime,
      friOpeningTime,
      satOpeningTime,
      sunOpeningTime,
      monClosingTime,
      tueClosingTime,
      wedClosingTime,
      thuClosingTime,
      friClosingTime,
      satClosingTime,
      sunClosingTime,
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
