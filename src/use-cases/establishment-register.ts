import { hash } from 'bcryptjs'
import { Establishment } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EmailNotAvailableException } from './errors/409-email-not-available-exception.ts'

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
    // It should hash establishment password upon registration
    const passwordHash = await hash(password, 6)

    // It should prevent a establishment register with a duplicate email
    const userWithSameEmail =
      await this.establishmentsRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailNotAvailableException(email)
    }

    // It should allow to register a establishment
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
    return {
      establishment,
    }
  }
}
