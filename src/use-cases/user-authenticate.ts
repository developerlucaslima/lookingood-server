import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'
import { InvalidCredentialsException } from './errors/401-invalid-credentials-exception'

interface UserAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface UserAuthenticateUseCaseResponse {
  user: User
}

export class UserAuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: UserAuthenticateUseCaseRequest): Promise<UserAuthenticateUseCaseResponse> {
    // It should prevent user authenticate with wrong email
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new InvalidCredentialsException()
    }

    // It should prevent user authenticate with wrong password
    const doesPasswordsMatch = await compare(password, user.passwordHash)
    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsException()
    }

    // It should allow user authenticate
    return {
      user,
    }
  }
}
