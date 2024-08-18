import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { UserProfileUseCase } from '../user-profile'

export function userProfileFactory() {
  const usersRepository = new PrismaUsersRepository()
  const userProfileUseCase = new UserProfileUseCase(usersRepository)

  return userProfileUseCase
}
