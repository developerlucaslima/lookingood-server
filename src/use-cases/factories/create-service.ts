import { ServicesRepository } from '@/repositories/services-repository'
import { Service } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { InvalidServiceGenderError } from '../errors/invalid-service-gender-error'

interface CreateServiceUseCaseRequest {
  name: string
  price: number
  gender: string
  description: string | null
  imageUrl: string | null
  establishmentId: string
}

interface CreateServiceUseCaseResponse {
  service: Service
}

export class CreateServiceUseCase {
  constructor(
    private establishmentRepository: EstablishmentsRepository,
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    name,
    price,
    gender,
    description,
    imageUrl,
    establishmentId,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const establishment =
      await this.establishmentRepository.findById(establishmentId)

    if (!establishment) {
      throw new ResourceNotFoundError()
    }

    if (!['Male', 'Female', 'Both'].includes(gender)) {
      throw new InvalidServiceGenderError()
    }

    const service = await this.servicesRepository.create({
      name,
      price,
      gender,
      description,
      imageUrl,
      establishmentId,
    })

    return {
      service,
    }
  }
}
