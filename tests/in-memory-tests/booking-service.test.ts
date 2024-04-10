import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professional-repository'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository'
import { InMemorySchedulesRepository } from '@/repositories/in-memory/in-memory-schedule-repository'
import { BookingServiceUseCase } from '@/use-cases/booking-service'
import { HourNotAvailable } from '@/use-cases/errors/hour-not-available'
import { InvalidTimetableError } from '@/use-cases/errors/invalid-timetable-error'
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error '
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error '

let establishmentsRepository: InMemoryEstablishmentsRepository
let professionalsRepository: InMemoryProfessionalsRepository
let bookingsRepository: InMemoryBookingsRepository
let servicesRepository: InMemoryServicesRepository
let schedulesRepository: InMemorySchedulesRepository
let usersRepository: InMemoryUsersRepository
let sut: BookingServiceUseCase

describe('Booking Service Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    professionalsRepository = new InMemoryProfessionalsRepository()
    servicesRepository = new InMemoryServicesRepository()
    bookingsRepository = new InMemoryBookingsRepository()
    schedulesRepository = new InMemorySchedulesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new BookingServiceUseCase(
      establishmentsRepository,
      professionalsRepository,
      servicesRepository,
      schedulesRepository,
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

    const professionalData = {
      id: 'Professional-01',
      name: 'John Doe',
      imageUrl: 'image.url',
      establishmentId: 'Barber-01',
    }
    professionalsRepository.items.set(professionalData.id, professionalData)

    servicesRepository.items.push({
      id: 'Service-01',
      name: 'Hair cut',
      price: new Decimal(40),
      genderFor: 'Male',
      description: 'Male hair cut',
      imageUrl: 'image.url',
      modificationDeadlineMinutes: 60,
      establishmentId: 'Barber-01',
      durationMinutes: 15,
    })

    usersRepository.items.push({
      id: 'User-01',
      name: 'John Doe',
      serviceGender: 'Male',
      email: 'johndoe@example.com',
      passwordHash: '123456',
      createdAt: new Date(),
    })

    schedulesRepository.items.push({
      id: 'Schedule-01',
      monOpeningTime: '08:00',
      tueOpeningTime: '08:00',
      wedOpeningTime: '08:00',
      thuOpeningTime: '08:00',
      friOpeningTime: '08:00',
      satOpeningTime: '08:00',
      sunOpeningTime: null,
      monClosingTime: '20:00',
      tueClosingTime: '20:00',
      wedClosingTime: '20:00',
      thuClosingTime: '20:00',
      friClosingTime: '20:00',
      satClosingTime: '17:00',
      sunClosingTime: null,
      establishmentId: 'Barber-01',
    })
  })

  it('should be able to booking a service', async () => {
    const { booking } = await sut.execute({
      startTime: new Date(2024, 1, 1, 9, 0, 0),
      professionalId: 'Professional-01',
      serviceId: 'Service-01',
      userId: 'User-01',
    })

    expect(booking.id).toEqual(expect.any(String))
  })

  it('should not be able to book a service with nonexistent professionalId', async () => {
    await expect(() =>
      sut.execute({
        startTime: new Date(2024, 1, 1, 9, 0, 0),
        professionalId: 'Professional-02',
        serviceId: 'Service-01',
        userId: 'User-01',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError)
  })

  it('should not be able to book a service with nonexistent serviceId', async () => {
    await expect(() =>
      sut.execute({
        startTime: new Date(2024, 1, 1, 9, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-02',
        userId: 'User-01',
      }),
    ).rejects.toBeInstanceOf(ServiceNotFoundError)
  })

  it('should not be able to book a service with nonexistent userId', async () => {
    await expect(() =>
      sut.execute({
        startTime: new Date(2024, 1, 1, 9, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-02',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to book a service with professional from different establishment', async () => {
    const professionalData = {
      id: 'Professional-02',
      name: 'John Doe',
      imageUrl: 'image.url',
      establishmentId: 'Barber-02',
    }
    professionalsRepository.items.set(professionalData.id, professionalData)

    await expect(() =>
      sut.execute({
        startTime: new Date(2024, 1, 1, 9, 0, 0),
        professionalId: 'Professional-02',
        serviceId: 'Service-01',
        userId: 'User-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to book a service with any other status than "Waiting for confirmation"', async () => {
    const { booking } = await sut.execute({
      startTime: new Date(2024, 1, 1, 9, 0, 0),
      professionalId: 'Professional-01',
      serviceId: 'Service-01',
      userId: 'User-01',
    })

    expect(booking.status).toEqual('Waiting for confirmation')
  })

  it('should not be able to book if the professional is already booked at the same time', async () => {
    const startTime = new Date(2024, 1, 1, 9, 0, 0)

    await sut.execute({
      startTime,
      professionalId: 'Professional-01',
      serviceId: 'Service-01',
      userId: 'User-01',
    })

    await expect(() =>
      sut.execute({
        startTime,
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-01',
      }),
    ).rejects.toBeInstanceOf(InvalidTimetableError)
  })

  it("should not be able to book a service outside of the establishment's operating hours", async () => {
    await expect(() =>
      sut.execute({
        startTime: new Date(2024, 1, 3, 7, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-01',
      }),
    ).rejects.toBeInstanceOf(HourNotAvailable)

    await expect(() =>
      sut.execute({
        startTime: new Date(2024, 1, 4, 9, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-01',
      }),
    ).rejects.toBeInstanceOf(HourNotAvailable)
  })
})
