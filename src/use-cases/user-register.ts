import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { $Enums, User } from '@prisma/client'
import { EmailNotAvailableException } from './errors/409-email-not-available-exception.ts'
import { InvalidGenderException } from './errors/422-invalid-gender-exception.js'

interface UserRegisterUseCaseRequest {
  name: string
  serviceGender: $Enums.Gender
  email: string
  password: string
}

interface UserRegisterUseCaseResponse {
  user: User
}

export class UserRegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    serviceGender,
    email,
    password,
  }: UserRegisterUseCaseRequest): Promise<UserRegisterUseCaseResponse> {
    // it should check if a user with the same email already exists
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailNotAvailableException(email)
    }

    // it should validate the service gender provided
    if (!['MALE', 'FEMALE', 'BOTH'].includes(serviceGender)) {
      throw new InvalidGenderException(`${serviceGender} is not valid.`)
    }

    // it should hash the provided password
    const passwordHash = await hash(password, 6)

    // it should create a new user
    const user = await this.usersRepository.create({
      name,
      serviceGender,
      email,
      passwordHash,
    })

    // it should return the created user
    return {
      user,
    }
  }
}
