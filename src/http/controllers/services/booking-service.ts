import { makeBookingServiceUseCase } from '@/use-cases/factories/make-booking-service-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { startTime, serviceId, professionalId } = z
    .object({
      startTime: z.date().min(new Date(), {
        message: "That date has passed, we don't have a time machine. 😑",
      }),
      serviceId: z.string().uuid(),
      professionalId: z.string().uuid(),
    })
    .parse(request.body)

  const bookingServiceUseCase = makeBookingServiceUseCase()

  await bookingServiceUseCase.execute({
    startTime,
    userId: request.user.sub,
    serviceId,
    professionalId,
  })

  return reply.status(201).send()
}
