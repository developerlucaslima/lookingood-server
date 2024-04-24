import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

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
    // it should find the user by their email
    const user = await this.usersRepository.findByEmail(email)

    // it should throw an error if the user is not found
    if (!user) {
      throw new InvalidCredentialsError()
    }

    // it should compare the provided password with the user's password hash
    const doesPasswordsMatch = await compare(password, user.passwordHash)

    // it should throw an error if the passwords don't match
    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    // it should return the authenticated user
    return {
      user,
    }
  }
}
