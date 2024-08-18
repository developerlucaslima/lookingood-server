import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeConfirmBookingServiceUseCase } from '@/use-cases/factories/make-service-booking-confirmation-use-case'

export async function confirmBookingServiceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { bookingId, establishmentId } = z
    .object({
      bookingId: z.string().uuid(),
      establishmentId: z.string().uuid(),
    })
    .parse(request.params)

  const confirmBookedServicesUseCase = makeConfirmBookingServiceUseCase()

  await confirmBookedServicesUseCase.execute({
    bookingId,
    establishmentId,
  })

  return reply.status(204).send()
}
