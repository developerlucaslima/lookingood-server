import { ServicesRepository } from '@/repositories/services-repository'
import { $Enums, Service } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EstablishmentNotFoundException } from './errors/404-establishment-not-found-exception'
import { InvalidServiceDurationException } from './errors/422-invalid-service-duration-exception'
import { InvalidGenderException } from './errors/422-invalid-gender-exception'
import { isValidServiceDuration } from '@/utils/is-valid-service-duration'

interface AddServiceUseCaseRequest {
  name: string
  price: number
  genderFor: $Enums.Gender
  description: string | null
  imageUrl: string | null
  modificationDeadlineMinutes: number
  establishmentId: string
  durationMinutes: number
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
    modificationDeadlineMinutes,
    establishmentId,
    durationMinutes,
  }: AddServiceUseCaseRequest): Promise<AddServiceUseCaseResponse> {
    // it shouldn't be possible to add a service if the establishment doesn't exist
    const establishment =
      await this.establishmentRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // it should validate the duration of the service
    if (!isValidServiceDuration(durationMinutes)) {
      throw new InvalidServiceDurationException()
    }

    // it should validate the gender specification for the service
    if (!['MALE', 'FEMALE', 'BOTH'].includes(genderFor)) {
      throw new InvalidGenderException()
    }

    // it should be possible to add a service
    const service = await this.servicesRepository.create({
      name,
      price,
      genderFor,
      description,
      imageUrl,
      modificationDeadlineMinutes,
      establishmentId,
      durationMinutes,
    })

    // it should return the added service
    return {
      service,
    }
  }
}
