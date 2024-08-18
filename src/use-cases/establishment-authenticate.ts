import { Establishment } from '@prisma/client'
import { compare } from 'bcryptjs'

import { InvalidCredentialsException } from '@/errors/invalid-credentials.exception'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'

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
      throw new InvalidCredentialsException()
    }

    // It should prevent establishment authenticate with wrong password.
    const doesPasswordsMatch = await compare(
      password,
      establishment.passwordHash,
    )
    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsException()
    }

    // It should allow establishment authenticate.
    return {
      establishment,
    }
  }
}
