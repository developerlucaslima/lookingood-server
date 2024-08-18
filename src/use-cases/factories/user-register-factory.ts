import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { UserRegisterUseCase } from '../user-register'

export function userRegisterFactory() {
  const usersRepository = new PrismaUsersRepository()
  const userRegisterUseCase = new UserRegisterUseCase(usersRepository)

  return userRegisterUseCase
}
