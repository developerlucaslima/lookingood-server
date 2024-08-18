import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'

import { UserNotFoundException } from '../errors/user-not-found.exception'

interface UserProfileUseCaseRequest {
  userId: string
}

interface UserProfileUseCaseResponse {
  user: User
}

export class UserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: UserProfileUseCaseRequest): Promise<UserProfileUseCaseResponse> {
    // It prevent get user profile if user does not exist.
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundException()
    }

    // It should allow get user profile.
    return {
      user,
    }
  }
}
