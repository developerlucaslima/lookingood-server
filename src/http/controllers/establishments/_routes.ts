import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { addEstablishmentScheduleController } from './add-establishment-schedule'
import { addProfessionalController } from './add-professional'
import { addProfessionalScheduleController } from './add-professional-schedule'
import { addServiceController } from './add-service'
import { establishmentAuthenticateController } from './establishment-authenticate'
import { establishmentProfileController } from './establishment-profile'
import { establishmentRefreshController } from './establishment-refresh'
import { establishmentRegisterController } from './establishment-register'

export async function appEstablishment(app: FastifyInstance) {
  app.post('/establishment-register', establishmentRegisterController)
  app.post('/establishment-auth', establishmentAuthenticateController)

  /** Token Refresh */
  app.patch('/token/establishment-refresh', establishmentRefreshController)

  /** Authenticated */
  app.post(
    '/establishment-schedule',
    { onRequest: [verifyJwt, verifyUserRole('ESTABLISHMENT')] },
    addEstablishmentScheduleController,
  )
  app.post(
    '/professional',
    { onRequest: [verifyJwt, verifyUserRole('ESTABLISHMENT')] },
    addProfessionalController,
  )
  app.post(
    '/professional-schedule',
    { onRequest: [verifyJwt, verifyUserRole('ESTABLISHMENT')] },
    addProfessionalScheduleController,
  )
  app.post(
    '/service',
    { onRequest: [verifyJwt, verifyUserRole('ESTABLISHMENT')] },
    addServiceController,
  )
  app.get(
    '/us',
    { onRequest: [verifyJwt, verifyUserRole('ESTABLISHMENT')] },
    establishmentProfileController,
  )
}
