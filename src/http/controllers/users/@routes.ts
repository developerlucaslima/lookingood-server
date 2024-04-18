import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { userAuthenticate } from './user-authenticate'
import { userProfile } from './user-profile'
import { userRefresh } from './user-refresh'
import { userRegister } from './user-register'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function appUserRoutes(app: FastifyInstance) {
  app.post('/usersRegister', userRegister)
  app.post('/usersAuth', userAuthenticate)

  /** Token Refresh */
  app.patch('/token/userRefresh', userRefresh)

  /** Authenticated */
  app.get(
    '/me',
    { onRequest: [verifyJwt, verifyUserRole('User')] },
    userProfile,
  )
}
