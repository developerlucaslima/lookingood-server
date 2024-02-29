import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professional-repository'
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { BookingServiceUseCase } from '../factories/booking-service'
import { Decimal } from '@prisma/client/runtime/library'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InvalidServiceGenderError } from '../errors/invalid-service-gender-error'
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error'
import { rejects } from 'assert'

let establishmentsRepository: InMemoryEstablishmentsRepository
let professionalsRepository: InMemoryProfessionalsRepository
let bookingsRepository: InMemoryBookingsRepository
let servicesRepository: InMemoryServicesRepository
let usersRepository: InMemoryUsersRepository
let sut: BookingServiceUseCase

describe('Booking Service Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    professionalsRepository = new InMemoryProfessionalsRepository()
    servicesRepository = new InMemoryServicesRepository()
    bookingsRepository = new InMemoryBookingsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new BookingServiceUseCase(
      establishmentsRepository,
      professionalsRepository,
      servicesRepository,
      bookingsRepository,
      usersRepository,
    )

    establishmentsRepository.items.push({
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

    professionalsRepository.items.push({
      id: 'Professional-01',
      name: 'John Doe',
      imageUrl: 'image.url',
      establishmentId: 'Barber-01',
    })

    servicesRepository.items.push({
      id: 'Service-01',
      name: 'Hair cut',
      price: new Decimal(40),
      genderFor: 'Male',
      description: 'Male hair cut',
      imageUrl: 'image.url',
      establishmentId: 'Barber-01',
    })

    usersRepository.items.push({
      id: 'User-01',
      name: 'John Doe',
      serviceGender: 'Male',
      email: 'johndoe@example.com',
      passwordHash: '123456',
      createdAt: new Date(),
    })
  })

  it('should be able to booking a service', async () => {
    const { booking } = await sut.execute({
      date: new Date(2022, 1, 1),
      professionalId: 'Professional-01',
      serviceId: 'Service-01',
      userId: 'User-01',
    })

    expect(booking.id).toEqual(expect.any(String))
  })

  it('should not be able to book a service with nonexistent professionalId', async () => {
    await expect(() =>
      sut.execute({
        date: new Date(2022, 1, 1),
        professionalId: 'Professional-02',
        serviceId: 'Service-01',
        userId: 'User-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to book a service with nonexistent serviceId', async () => {
    await expect(() =>
      sut.execute({
        date: new Date(2022, 1, 1),
        professionalId: 'Professional-01',
        serviceId: 'Service-02',
        userId: 'User-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to book a service with nonexistent userId', async () => {
    await expect(() =>
      sut.execute({
        date: new Date(2022, 1, 1),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-02',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to book a service with professional from different establishment', async () => {
    professionalsRepository.items.push({
      id: 'Professional-02',
      name: 'John Doe',
      imageUrl: 'image.url',
      establishmentId: 'Barber-02',
    })

    await expect(() =>
      sut.execute({
        date: new Date(2022, 1, 1),
        professionalId: 'Professional-02',
        serviceId: 'Service-01',
        userId: 'User-02',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to book a service with any other status than "Waiting for confirmation"', async () => {
    const { booking } = await sut.execute({
      date: new Date(2022, 1, 1),
      professionalId: 'Professional-01',
      serviceId: 'Service-01',
      userId: 'User-01',
    })

    expect(booking.status).toEqual('Waiting for confirmation')
  })
})
