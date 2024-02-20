import { ServicesRepository } from '@/repositories/services-repository'
import { Service } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'

interface CreateServiceUseCaseRequest {
  name: string
  price: number
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
    description,
    imageUrl,
    establishmentId,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const establishment =
      await this.establishmentRepository.findById(establishmentId)

    if (!establishment) {
      throw new ResourceNotFoundError()
    }

    const service = await this.servicesRepository.create({
      name,
      price,
      description,
      imageUrl,
      establishmentId,
    })

    return {
      service,
    }
  }
}
