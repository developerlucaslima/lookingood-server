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
    // It prevent get establishment profile if establishment does not exist
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // It should allow establishment authenticate
    return {
      establishment,
    }
  }
}
