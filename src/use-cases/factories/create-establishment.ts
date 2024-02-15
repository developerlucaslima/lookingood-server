import { EstablishmentsRepository } from '@/repositories/establishment-repository'
import { Establishment } from '@prisma/client'

interface CreateEstablishmentUseCaseRequest {
  name: string
  description: string | null
  phone: string | null
  imageUrl: string | null
  latitude: number
  longitude: number
}

interface CreateEstablishmentUseCaseResponse {
  establishment: Establishment
}

export class CreateEstablishmentUseCase {
  constructor(private establishmentRepository: EstablishmentsRepository) {}

  async execute({
    name,
    description,
    phone,
    imageUrl,
    latitude,
    longitude,
  }: CreateEstablishmentUseCaseRequest): Promise<CreateEstablishmentUseCaseResponse> {
    const establishment = await this.establishmentRepository.create({
      name,
      description,
      phone,
      imageUrl,
      latitude,
      longitude,
    })

    return {
      establishment,
    }
  }
}
