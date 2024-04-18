import { makeConfirmBookedServicesUseCase } from '@/use-cases/factories/make-confirm-booked-service-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function confirmBookedService(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { bookingId, establishmentId } = z
    .object({
      bookingId: z.string().uuid(),
      establishmentId: z.string().uuid(),
    })
    .parse(request.params)

  const confirmBookedServicesUseCase = makeConfirmBookedServicesUseCase()

  await confirmBookedServicesUseCase.execute({
    bookingId,
    establishmentId,
  })

  return reply.status(204).send()
}
