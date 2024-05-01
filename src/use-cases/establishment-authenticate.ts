import { compare } from 'bcryptjs'
import { Establishment } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { UnauthorizedCredentialsException } from './errors/401-unauthorized-credentials-exception'

interface EstablishmentAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface EstablishmentAuthenticateUseCaseResponse {
  establishment: Establishment
}

export class EstablishmentAuthenticateUseCase {
  constructor(private establishmentsRepository: EstablishmentsRepository) {}

  async execute({
    email,
    password,
  }: EstablishmentAuthenticateUseCaseRequest): Promise<EstablishmentAuthenticateUseCaseResponse> {
    // It should prevent establishment authenticate with wrong email.
    const establishment = await this.establishmentsRepository.findByEmail(email)
    if (!establishment) {
      throw new UnauthorizedCredentialsException()
    }

    // It should prevent establishment authenticate with wrong password.
    const doesPasswordsMatch = await compare(
      password,
      establishment.passwordHash,
    )
    if (!doesPasswordsMatch) {
      throw new UnauthorizedCredentialsException()
    }

    // It should allow establishment authenticate.
    return {
      establishment,
    }
  }
}
