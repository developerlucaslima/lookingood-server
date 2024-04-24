import { compare } from 'bcryptjs'
import { Establishment } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

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
    // it should retrieve the establishment by email
    const establishment = await this.establishmentsRepository.findByEmail(email)

    // it should throw an error if the establishment doesn't exist
    if (!establishment) {
      throw new InvalidCredentialsError()
    }

    // it should compare the provided password with the establishment's password hash
    const doesPasswordsMatch = await compare(
      password,
      establishment.passwordHash,
    )

    // it should throw an error if the passwords don't match
    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    // it should return the authenticated establishment
    return {
      establishment,
    }
  }
}
