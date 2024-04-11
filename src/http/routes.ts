import { FastifyInstance } from 'fastify'
import { userAuthenticate } from './controllers/user-authenticate'
import { userProfile } from './controllers/user-profile'
import { verifyJwt } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', userProfile)
  app.post('/usersAuth', userAuthenticate)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, userProfile)
}
