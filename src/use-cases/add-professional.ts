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
    // it shouldn't be possible to add a professional if the establishment doesn't exist
    const establishment =
      await this.establishmentRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // it should be possible to add a professional
    const professional = await this.professionalsRepository.create({
      name,
      imageUrl,
      establishmentId,
    })

    // it should return the added professional
    return {
      professional,
    }
  }
}
