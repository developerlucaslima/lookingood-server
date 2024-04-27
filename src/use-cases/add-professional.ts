import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { Professional } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EstablishmentNotFoundException } from './errors/404-establishment-not-found-exception'

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
    // It should prevent add professional if the establishment does not exist
    const establishment =
      await this.establishmentRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // It should allow add professional
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
