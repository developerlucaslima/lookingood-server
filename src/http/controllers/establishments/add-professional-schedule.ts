import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error'
import { makeAddProfessionalScheduleUseCase } from '@/use-cases/factories/make-add-professional-schedule-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function addProfessionalSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  const invalidTime = 'Invalid time'

  const { startTime, minutesWorking, breakTime, minutesBreak } = z
    .object({
      startTime: z.string().regex(timeRegex, { message: invalidTime }),
      minutesWorking: z.number().min(2).max(4),
      breakTime: z.string().regex(timeRegex, { message: invalidTime }),
      minutesBreak: z.number().min(2).max(3),
    })
    .parse(request.body)

  try {
    const addProfessionalScheduleUseCase = makeAddProfessionalScheduleUseCase()

    await addProfessionalScheduleUseCase.execute({
      startTime,
      minutesWorking,
      breakTime,
      minutesBreak,
      professionalId: request.user.sub,
    })
  } catch (err) {
    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
