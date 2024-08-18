import { Professional } from '@prisma/client'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'

interface AddProfessionalUseCaseRequest {
  name: string
  imageUrl: string | null
  establishmentId: string
}

interface AddProfessionalUseCaseResponse {
  professional: Professional
}

export class AddProfessionalUseCase {
  constructor(
    private establishmentRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    name,
    imageUrl,
    establishmentId,
  }: AddProfessionalUseCaseRequest): Promise<AddProfessionalUseCaseResponse> {
    // It should prevent add professional if the establishment does not exist.
    const establishment =
      await this.establishmentRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // It should allow add professional.
    const professional = await this.professionalsRepository.create({
      name,
      imageUrl,
      establishmentId,
    })
    return {
      professional,
    }
  }
}
