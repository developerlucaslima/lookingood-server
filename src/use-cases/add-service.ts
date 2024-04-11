import { ServicesRepository } from '@/repositories/services-repository'
import { Service } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { validateServiceDuration } from '@/utils/validate-service-duration'
import { EstablishmentNotFoundError } from '@/use-cases/errors/establishment-not-found-error'
import { InvalidServiceDurationError } from '@/use-cases/errors/invalid-service-duration-error'
import { InvalidServiceGenderError } from '@/use-cases/errors/invalid-service-gender-error'

interface AddServiceUseCaseRequest {
  name: string
  price: number
  genderFor: string
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
    const establishment =
      await this.establishmentRepository.findById(establishmentId)

    if (!establishment) {
      throw new EstablishmentNotFoundError()
    }

    const isValidServiceDuration = validateServiceDuration(durationMinutes)
    if (!isValidServiceDuration) {
      throw new InvalidServiceDurationError()
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
      modificationDeadlineMinutes,
      establishmentId,
      durationMinutes,
    })

    return {
      service,
    }
  }
}
