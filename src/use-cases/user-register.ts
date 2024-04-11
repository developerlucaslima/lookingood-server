import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { User } from '@prisma/client'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'
import { InvalidServiceGenderError } from '@/use-cases/errors/invalid-service-gender-error'

interface UserRegisterUseCaseRequest {
  name: string
  serviceGender: string
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
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyExistsError()
    }

    if (!['Male', 'Female', 'Both'].includes(serviceGender)) {
      throw new InvalidServiceGenderError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      serviceGender,
      email,
      passwordHash,
    })

    return {
      user,
    }
  }
}
