import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { userAuthenticateController } from './user-authenticate'
import { userProfileController } from './user-profile'
import { userRefreshController } from './user-refresh'
import { userRegisterController } from './user-register'

export async function appUserRoutes(app: FastifyInstance) {
  app.post('/user-register', userRegisterController)
  app.post('/user-auth', userAuthenticateController)

  /** Token Refresh */
  app.patch('/token/user-refresh', userRefreshController)

  /** Authenticated */
  app.get(
    '/me',
    { onRequest: [verifyJwt, verifyUserRole('USER')] },
    userProfileController,
  )
}
