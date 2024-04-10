import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { AddServiceUseCase } from '@/use-cases/add-service'
import { EstablishmentNotFoundError } from '@/use-cases/errors/establishment-not-found-error'
import { InvalidServiceDurationError } from '@/use-cases/errors/invalid-service-duration-error'
import { InvalidServiceGenderError } from '@/use-cases/errors/invalid-service-gender-error'

let servicesRepository: InMemoryServicesRepository
let establishmentRepository: InMemoryEstablishmentsRepository
let sut: AddServiceUseCase

describe('Add Service Use Case', () => {
  beforeEach(() => {
    establishmentRepository = new InMemoryEstablishmentsRepository()
    servicesRepository = new InMemoryServicesRepository()
    sut = new AddServiceUseCase(establishmentRepository, servicesRepository)

    establishmentRepository.items.push({
      id: 'Barber-01',
      name: 'John Barber',
      description: 'Best barber of the city',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'barber01@example.com',
      passwordHash: '123456',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
      createdAt: new Date(),
    })
  })

  it('should to create service', async () => {
    const { service } = await sut.execute({
      name: 'Hair cut',
      price: 40,
      genderFor: 'Male',
      description: 'Male hair cut',
      imageUrl: 'image.url',
      modificationDeadlineMinutes: 60,
      establishmentId: 'Barber-01',
      durationMinutes: 15,
    })
    expect(service.id).toEqual(expect.any(String))
  })

  it('should not be able to create service with nonexistent establishmentId', async () => {
    await expect(() =>
      sut.execute({
        name: 'Moustache',
        price: 40,
        genderFor: '',
        description: 'Trim your mustache',
        imageUrl: 'image.url',
        modificationDeadlineMinutes: 60,
        establishmentId: 'Barber-02',
        durationMinutes: 15,
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundError)
  })

  it('should validate serviceGender as "Both"', async () => {
    const { service } = await sut.execute({
      name: 'Hair cut',
      price: 40,
      genderFor: 'Both',
      description: 'Hair cut',
      imageUrl: 'image.url',
      modificationDeadlineMinutes: 60,
      establishmentId: 'Barber-01',
      durationMinutes: 15,
    })
    expect(service.id).toEqual(expect.any(String))
  })

  it('should validate serviceGender as "Female"', async () => {
    const { service } = await sut.execute({
      name: 'Nails',
      price: 40,
      genderFor: 'Female',
      description: 'Do the nails',
      imageUrl: 'image.url',
      modificationDeadlineMinutes: 60,
      establishmentId: 'Barber-01',
      durationMinutes: 15,
    })
    expect(service.id).toEqual(expect.any(String))
  })

  it('should validate serviceGender as "Male"', async () => {
    const { service } = await sut.execute({
      name: 'Moustache',
      price: 40,
      genderFor: 'Male',
      description: 'Trim your mustache',
      imageUrl: 'image.url',
      modificationDeadlineMinutes: 60,
      establishmentId: 'Barber-01',
      durationMinutes: 15,
    })
    expect(service.id).toEqual(expect.any(String))
  })

  it('should not be allowed to register service gender unless specified as "Male", "Female" or "Both"', async () => {
    await expect(() =>
      sut.execute({
        name: 'Moustache',
        price: 40,
        genderFor: 'Invalid',
        description: 'Trim your mustache',
        imageUrl: 'image.url',
        modificationDeadlineMinutes: 60,
        establishmentId: 'Barber-01',
        durationMinutes: 15,
      }),
    ).rejects.toBeInstanceOf(InvalidServiceGenderError)
  })

  it('should not be allowed to register service gender as blank', async () => {
    await expect(() =>
      sut.execute({
        name: 'Moustache',
        price: 40,
        genderFor: '',
        description: 'Trim your mustache',
        imageUrl: 'image.url',
        modificationDeadlineMinutes: 60,
        establishmentId: 'Barber-01',
        durationMinutes: 15,
      }),
    ).rejects.toBeInstanceOf(InvalidServiceGenderError)
  })

  it('should not be allowed to register service with durations under 15 minutes', async () => {
    await expect(() =>
      sut.execute({
        name: 'Moustache',
        price: 40,
        genderFor: '',
        description: 'Trim your mustache',
        imageUrl: 'image.url',
        modificationDeadlineMinutes: 60,
        establishmentId: 'Barber-01',
        durationMinutes: 0,
      }),
    ).rejects.toBeInstanceOf(InvalidServiceDurationError)
  })

  it('should not be allowed to register service with durations that are not multiples of 15 minutes', async () => {
    await expect(() =>
      sut.execute({
        name: 'Moustache',
        price: 40,
        genderFor: '',
        description: 'Trim your mustache',
        imageUrl: 'image.url',
        modificationDeadlineMinutes: 60,
        establishmentId: 'Barber-01',
        durationMinutes: 31,
      }),
    ).rejects.toBeInstanceOf(InvalidServiceDurationError)
  })
})
