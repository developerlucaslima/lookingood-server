import { makeChangeBookedServicesUseCase } from '@/use-cases/factories/make-change-booked-service-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function changeBookedService(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = z
    .object({
      userId: z.string().uuid(),
    })
    .parse(request.params)

  const { startTime, serviceId, bookingId } = z
    .object({
      startTime: z.date().min(new Date(), {
        message: "That date has passed, we don't have a time machine. 😑",
      }),
      serviceId: z.string().uuid(),
      bookingId: z.string().uuid(),
    })
    .parse(request.body)

  const changeBookedServicesUseCase = makeChangeBookedServicesUseCase()

  await changeBookedServicesUseCase.execute({
    startTime,
    userId,
    serviceId,
    bookingId,
  })

  return reply.status(204).send()
}
