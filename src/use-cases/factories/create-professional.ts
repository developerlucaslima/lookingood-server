import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { Professional } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'

interface CreateProfessionalUseCaseRequest {
  name: string
  imageUrl: string | null
  establishmentId: string
}

interface CreateProfessionalUseCaseResponse {
  professional: Professional
}

export class CreateProfessionalUseCase {
  constructor(
    private establishmentRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    name,
    imageUrl,
    establishmentId,
  }: CreateProfessionalUseCaseRequest): Promise<CreateProfessionalUseCaseResponse> {
    const establishment =
      await this.establishmentRepository.findById(establishmentId)

    if (!establishment) {
      throw new ResourceNotFoundError()
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
