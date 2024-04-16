import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { userAuthenticate } from './user-authenticate'
import { userProfile } from './user-profile'
import { userRefresh } from './user-refresh'
import { userRegister } from './user-register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/usersRegister', userRegister)
  app.post('/usersAuth', userAuthenticate)

  app.patch('/token/refresh', userRefresh)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, userProfile)
}
