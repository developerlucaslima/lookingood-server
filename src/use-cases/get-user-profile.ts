import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    // it should find the user by their ID
    const user = await this.usersRepository.findById(userId)

    // it should throw an error if the user is not found
    if (!user) {
      throw new ResourceNotFoundError()
    }

    // it should return the profile of the user
    return {
      user,
    }
  }
}
