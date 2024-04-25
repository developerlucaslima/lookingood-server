import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { Establishment } from '@prisma/client'
import { EstablishmentNotFoundException } from './errors/404-establishment-not-found-exception'

interface GetEstablishmentProfileUseCaseRequest {
  establishmentId: string
}

interface GetEstablishmentProfileUseCaseResponse {
  establishment: Establishment
}

export class GetEstablishmentProfileUseCase {
  constructor(private establishmentsRepository: EstablishmentsRepository) {}

  async execute({
    establishmentId,
  }: GetEstablishmentProfileUseCaseRequest): Promise<GetEstablishmentProfileUseCaseResponse> {
    // it should find the establishment by its ID
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)

    // it should throw an error if the establishment is not found
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // it should return the profile of the establishment
    return {
      establishment,
    }
  }
}
