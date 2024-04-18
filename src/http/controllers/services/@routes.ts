import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { bookingService } from './booking-service'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { changeBookedService } from './change-booked-service'
import { confirmBookedService } from './confirm-booked-service'

export async function appServiceRoutes(app: FastifyInstance) {
  app.post(
    '/booking',
    { onRequest: [verifyJwt, verifyUserRole('User')] },
    bookingService,
  )
  app.put(
    '/change',
    { onRequest: [verifyJwt, verifyUserRole('User')] },
    changeBookedService,
  )
  app.patch(
    '/confirm',
    { onRequest: [verifyJwt, verifyUserRole('Establishment')] },
    confirmBookedService,
  )
}
