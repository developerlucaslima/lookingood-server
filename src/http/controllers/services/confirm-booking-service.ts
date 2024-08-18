import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { confirmBookingServiceFactory } from '@/use-cases/factories/confirm-booking-service-factory'

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

  const confirmBookedServicesUseCase = confirmBookingServiceFactory()

  await confirmBookedServicesUseCase.execute({
    bookingId,
    establishmentId,
  })

  return reply.status(204).send()
}
