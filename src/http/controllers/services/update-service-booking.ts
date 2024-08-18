import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateBookingServiceUseCase } from '@/use-cases/factories/make-service-booking-update-use-case'

export async function updateBookingServiceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = z
    .object({
      userId: z.string().uuid(),
    })
    .parse(request.params)

  const { startTime, serviceId, bookingId, professionalId } = z
    .object({
      startTime: z.date().min(new Date(), {
        message: "That date has passed, we don't have a time machine. 😑",
      }),
      serviceId: z.string().uuid(),
      bookingId: z.string().uuid(),
      professionalId: z.string().uuid(),
    })
    .parse(request.body)

  const updateBookingServiceUseCase = makeUpdateBookingServiceUseCase()

  await updateBookingServiceUseCase.execute({
    professionalId,
    startTime,
    userId,
    serviceId,
    bookingId,
  })

  return reply.status(204).send()
}
