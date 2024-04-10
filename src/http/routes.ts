import { FastifyInstance } from 'fastify'
import { userAuthenticate } from './controllers/user-authenticate'
import { userProfile } from './controllers/user-profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', userProfile)
  app.post('/usersAuth', userAuthenticate)

  /** Authenticated */
  app.get('/me', userProfile)
}
