import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { Establishment } from '@prisma/client'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'

interface EstablishmentRegisterUseCaseRequest {
  name: string
  description: string | null
  phone: string | null
  imageUrl: string
  email: string
  password_hash: string
  latitude: number
  longitude: number
}

interface EstablishmentRegisterUseCaseResponse {
  establishment: Establishment
}

export class EstablishmentRegisterUseCase {
  constructor(private establishmentsRepository: EstablishmentsRepository) {}

  async execute({
    name,
    description,
    phone,
    imageUrl,
    email,
    password_hash,
    latitude,
    longitude,
  }: EstablishmentRegisterUseCaseRequest): Promise<EstablishmentRegisterUseCaseResponse> {
    const userWithSameEmail =
      await this.establishmentsRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
