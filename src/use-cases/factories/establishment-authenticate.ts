import { compare } from 'bcryptjs'
import { Establishment } from '@prisma/client'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
interface EstablishmentAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface EstablishmentAuthenticateUseCaseResponse {
  establishment: Establishment
}

export class EstablishmentAuthenticateUseCase {
  constructor(private establishmentRepository: EstablishmentsRepository) {}

  async execute({
    email,
    password,
  }: EstablishmentAuthenticateUseCaseRequest): Promise<EstablishmentAuthenticateUseCaseResponse> {
    const establishment = await this.establishmentRepository.findByEmail(email)

    if (!establishment) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordsMatches = await compare(
      password,
      establishment.password_hash,
    )

    if (!doesPasswordsMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      establishment,
    }
  }
}
