import { $Enums, Service } from '@prisma/client'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ServicesRepository } from '@/repositories/services-repository'
import { isValidServiceDuration } from '@/utils/is-valid-service-duration'

import { InvalidGenderException } from '../errors/invalid-gender.exception'
import { InvalidServiceDurationException } from '../errors/invalid-service-duration.exception'

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
    // It should prevent add service if the establishment does not exist.
    const establishment =
      await this.establishmentRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // It should prevent adding a service if the duration is not a multiple of 15 minutes.
    if (!isValidServiceDuration(durationMinutes)) {
      throw new InvalidServiceDurationException()
    }

    // It should prevent add service if gender is not valid.
    if (!['MALE', 'FEMALE', 'BOTH'].includes(genderFor)) {
      throw new InvalidGenderException()
    }

    // It should allow add service.
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
