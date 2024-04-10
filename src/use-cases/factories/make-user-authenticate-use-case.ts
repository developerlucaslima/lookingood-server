import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAuthenticateUseCase } from '../user-authenticate'

export function makeUserAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const userAuthenticateUseCase = new UserAuthenticateUseCase(usersRepository)

  return userAuthenticateUseCase
}
