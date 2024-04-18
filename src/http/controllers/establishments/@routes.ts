import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { addProfessional } from './add-professional'
import { addSchedule } from './add-schedule'
import { addService } from './add-service'
import { establishmentAuthenticate } from './establishment-authenticate'
import { establishmentProfile } from './establishment-profile'
import { establishmentRefresh } from './establishment-refresh'
import { establishmentRegister } from './establishment-register'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function appEstablishment(app: FastifyInstance) {
  app.post('/establishmentRegister', establishmentRegister)
  app.post('/establishmentAuth', establishmentAuthenticate)

  /** Token Refresh */
  app.patch('/token/establishmentRefresh', establishmentRefresh)

  /** Authenticated */
  app.post(
    '/professional',
    { onRequest: [verifyJwt, verifyUserRole('Establishment')] },
    addProfessional,
  )
  app.post(
    '/schedule',
    { onRequest: [verifyJwt, verifyUserRole('Establishment')] },
    addSchedule,
  )
  app.post(
    '/service',
    { onRequest: [verifyJwt, verifyUserRole('Establishment')] },
    addService,
  )
  app.get(
    '/us',
    { onRequest: [verifyJwt, verifyUserRole('Establishment')] },
    establishmentProfile,
  )
}
