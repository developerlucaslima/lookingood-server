import { hash } from 'bcryptjs'
import { Establishment } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EmailNotAvailableError } from './errors/email-not-available-error'

interface EstablishmentRegisterUseCaseRequest {
  name: string
  description: string | null
  phone: string | null
  imageUrl: string | null
  email: string
  password: string
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
    password,
    latitude,
    longitude,
  }: EstablishmentRegisterUseCaseRequest): Promise<EstablishmentRegisterUseCaseResponse> {
    // it should check if an establishment with the same email already exists
    const userWithSameEmail =
      await this.establishmentsRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailNotAvailableError(email)
    }

    // it should hash the provided password
    const passwordHash = await hash(password, 6)

    // it should create a new establishment with the provided data
    const establishment = await this.establishmentsRepository.create({
      name,
      description,
      phone,
      imageUrl,
      email,
      passwordHash,
      latitude,
      longitude,
    })

    // it should return the newly created establishment
    return {
      establishment,
    }
  }
}
