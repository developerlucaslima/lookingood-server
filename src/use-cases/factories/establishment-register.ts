import { hash } from 'bcryptjs'
import { Establishment } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EmailAlreadyExistsError } from '../errors/email-already-exists-error'

interface EstablishmentRegisterUseCaseRequest {
  name: string
  description: string | null
  phone: string | null
  imageUrl: string
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
    const userWithSameEmail =
      await this.establishmentsRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

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
