import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professional-repository'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository'
import { InMemorySchedulesRepository } from '@/repositories/in-memory/in-memory-schedule-repository'
import { ConfirmBookingServiceUseCase } from '../factories/confirm-booking-service'

let establishmentsRepository: InMemoryEstablishmentsRepository
let professionalsRepository: InMemoryProfessionalsRepository
let bookingsRepository: InMemoryBookingsRepository
let servicesRepository: InMemoryServicesRepository
let schedulesRepository: InMemorySchedulesRepository
let usersRepository: InMemoryUsersRepository
let sut: ConfirmBookingServiceUseCase

describe('Booking Service Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    professionalsRepository = new InMemoryProfessionalsRepository()
    servicesRepository = new InMemoryServicesRepository()
    bookingsRepository = new InMemoryBookingsRepository()
    schedulesRepository = new InMemorySchedulesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new ConfirmBookingServiceUseCase(bookingsRepository)

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

    bookingsRepository.items.push({
      id: 'Booking-01',
      status: 'Waiting for confirmation',
      startTime: new Date(2024, 1, 1, 9, 0, 0),
      endTime: new Date(2024, 1, 1, 9, 30, 0),
      professionalId: 'Professional-02',
      serviceId: 'Service-01',
      userId: 'User-01',
    })
  })

  it('should be able to booking a service', async () => {
    const { booking } = await sut.execute({
      bookingId: 'Booking-01',
    })

    expect(booking.status).toEqual('Confirmed')
  })
})
