import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

import { InvalidCredentialsException } from '@/errors/invalid-credentials.exception'
import { UsersRepository } from '@/repositories/users-repository'

interface UserAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface UserAuthenticateUseCaseResponse {
  user: User
}

export class UserAuthenticateUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: UserAuthenticateUseCaseRequest): Promise<UserAuthenticateUseCaseResponse> {
    // It should prevent user authenticate with wrong email.
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new InvalidCredentialsException()
    }

    // It should prevent user authenticate with wrong password.
    const doesPasswordsMatch = await compare(password, user.passwordHash)
    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsException()
    }

    // It should allow user authenticate.
    return {
      user,
    }
  }
}
