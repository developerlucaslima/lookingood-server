import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { AddServiceUseCase } from '@/use-cases/add-service'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'
import { InvalidGenderException } from '@/use-cases/errors/422-invalid-gender-exception'
import { InvalidServiceDurationException } from '@/use-cases/errors/422-invalid-service-duration-exception'
import { establishmentsSetup } from 'tests/setup/establishments-setup'
import { describe, beforeEach, it, expect } from 'vitest'

let establishmentRepository: InMemoryEstablishmentsRepository
let servicesRepository: InMemoryServicesRepository
let sut: AddServiceUseCase

describe('Add Service Use Case', () => {
  beforeEach(() => {
    establishmentRepository = new InMemoryEstablishmentsRepository()
    servicesRepository = new InMemoryServicesRepository()
    sut = new AddServiceUseCase(establishmentRepository, servicesRepository)

    establishmentsSetup(establishmentRepository)
  })

  it('should allow adding a service', async () => {
    const { service } = await sut.execute({
      name: 'Haircut',
      price: 20,
      genderFor: 'MALE',
      description: 'Standard haircut',
      imageUrl: 'haircut.jpg',
      modificationDeadlineMinutes: 60,
      establishmentId: 'Establishment-01',
      durationMinutes: 30,
    })

    expect(service.id).toEqual(expect.any(String))
  })

  it('should prevent add service if the establishment does not exist', async () => {
    await expect(() =>
      sut.execute({
        name: 'Haircut',
        price: 20,
        genderFor: 'MALE',
        description: 'Standard haircut',
        imageUrl: 'haircut.jpg',
        modificationDeadlineMinutes: 60,
        establishmentId: 'Nonexistent-Establishment-01', // invalid establishment
        durationMinutes: 30,
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })

  it('should prevent adding a service if the duration is not a multiple of 15 minutes', async () => {
    await expect(
      sut.execute({
        name: 'Haircut',
        price: 20,
        genderFor: 'MALE',
        description: 'Standard haircut',
        imageUrl: 'haircut.jpg',
        modificationDeadlineMinutes: 60,
        establishmentId: 'Establishment-01',
        durationMinutes: 31, // invalid duration
      }),
    ).rejects.toBeInstanceOf(InvalidServiceDurationException)
  })

  it('should prevent add service if gender is not valid', async () => {
    await expect(
      sut.execute({
        name: 'Haircut',
        price: 20,
        genderFor: 'INVALID_GENDER' as 'MALE', // invalid gender
        description: 'Standard haircut',
        imageUrl: 'haircut.jpg',
        modificationDeadlineMinutes: 60,
        establishmentId: 'Establishment-01',
        durationMinutes: 30,
      }),
    ).rejects.toBeInstanceOf(InvalidGenderException)
  })
})
