import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { bookingServiceController } from './service-booking'
import { confirmBookingServiceController } from './service-booking-confirmation'
import { updateBookingServiceController } from './service-booking-update'

export async function appServiceRoutes(app: FastifyInstance) {
  app.post(
    '/booking',
    { onRequest: [verifyJwt, verifyUserRole('USER')] },
    bookingServiceController,
  )
  app.put(
    '/update',
    { onRequest: [verifyJwt, verifyUserRole('USER')] },
    updateBookingServiceController,
  )
  app.patch(
    '/confirm',
    { onRequest: [verifyJwt, verifyUserRole('ESTABLISHMENT')] },
    confirmBookingServiceController,
  )
}
