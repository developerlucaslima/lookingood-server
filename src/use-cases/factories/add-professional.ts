import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { Professional } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EstablishmentNotFoundError } from '../errors/establishment-not-found-error'

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
    const establishment =
      await this.establishmentRepository.findById(establishmentId)

    if (!establishment) {
      throw new EstablishmentNotFoundError()
    }

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
