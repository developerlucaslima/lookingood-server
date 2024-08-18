import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { addEstablishmentScheduleFactory } from '@/use-cases/factories/add-establishment-schedule-factory'

export async function addEstablishmentScheduleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const timeRegex = /^(0[0-9,1[0-9]|2[0-3]):[0-5][0-9]$/
  const invalidTime = 'Invalid time'

  const { startTime, minutesWorking, breakTime, minutesBreak, weekDay } = z
    .object({
      startTime: z.string().regex(timeRegex, { message: invalidTime }),
      minutesWorking: z.number().min(2).max(4),
      breakTime: z.string().regex(timeRegex, { message: invalidTime }),
      minutesBreak: z.number().min(2).max(3),
      weekDay: z.enum([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ]),
    })
    .parse(request.body)

  try {
    const addEstablishmentScheduleUseCase = addEstablishmentScheduleFactory()

    await addEstablishmentScheduleUseCase.execute({
      startTime,
      minutesWorking,
      breakTime,
      minutesBreak,
      weekDay,
      establishmentId: request.user.sub,
    })
  } catch (err) {
    if (err instanceof EstablishmentNotFoundException) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
