import { ServicesRepository } from '@/repositories/services-repository'
import { $Enums, Service } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { validateServiceDuration } from '@/utils/validate-service-duration'
import { EstablishmentNotFoundError } from '@/use-cases/errors/establishment-not-found-error'
import { InvalidServiceDurationError } from '@/use-cases/errors/invalid-service-duration-error'
import { InvalidServiceGenderError } from '@/use-cases/errors/invalid-service-gender-error'

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
      throw new EstablishmentNotFoundError()
    }

    // it should validate the duration of the service
    const isValidServiceDuration = validateServiceDuration(durationMinutes)
    if (!isValidServiceDuration) {
      throw new InvalidServiceDurationError()
    }

    // it should validate the gender specification for the service
    if (!['MALE', 'FEMALE', 'BOTH'].includes(genderFor)) {
      throw new InvalidServiceGenderError()
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
