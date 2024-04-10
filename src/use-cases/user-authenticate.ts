import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface UserAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface UserAuthenticateUseCaseResponse {
  user: User
}

export class UserAuthenticateUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: UserAuthenticateUseCaseRequest): Promise<UserAuthenticateUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordsMatches = await compare(password, user.passwordHash)

    if (!doesPasswordsMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
