import { ServicesRepository } from '@/repositories/services-repository'
import { Service } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { InvalidServiceGenderError } from '../errors/invalid-service-gender-error'
import { EstablishmentNotFoundError } from '../errors/establishment-not-found-error'

interface AddServiceUseCaseRequest {
  name: string
  price: number
  genderFor: string
  description: string | null
  imageUrl: string | null
  establishmentId: string
}

interface AddServiceUseCaseResponse {
  service: Service
}

export class AddServiceUseCase {
  constructor(
    private establishmentRepository: EstablishmentsRepository,
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    name,
    price,
    genderFor,
    description,
    imageUrl,
    establishmentId,
  }: AddServiceUseCaseRequest): Promise<AddServiceUseCaseResponse> {
    const establishment =
      await this.establishmentRepository.findById(establishmentId)

    if (!establishment) {
      throw new EstablishmentNotFoundError()
    }

    if (!['Male', 'Female', 'Both'].includes(genderFor)) {
      throw new InvalidServiceGenderError()
    }

    const service = await this.servicesRepository.create({
      name,
      price,
      genderFor,
      description,
      imageUrl,
      establishmentId,
    })

    return {
      service,
    }
  }
}
