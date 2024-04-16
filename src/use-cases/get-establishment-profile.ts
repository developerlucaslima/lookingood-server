import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { Establishment } from '@prisma/client'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

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
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)

    if (!establishment) {
      throw new ResourceNotFoundError()
    }

    return {
      establishment,
    }
  }
}
