import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository'
import { BookingServiceUseCase } from '../factories/booking-service'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let establishmentsRepository: InMemoryEstablishmentsRepository
let bookingsRepository: InMemoryBookingsRepository
let usersRepository: InMemoryUsersRepository
let sut: BookingServiceUseCase

describe('Booking Service Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    bookingsRepository = new InMemoryBookingsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new BookingServiceUseCase(
      establishmentsRepository,
      bookingsRepository,
      usersRepository,
    )
  })

  it('should be able to booking a service', async () => {
    const { booking } = await sut.execute({
      date: new Date(2022, 1, 1),
      status: 'Pendente',
      userId: 'user-01',
      serviceId: 'service-01',
      establishmentId: 'establishment-01',
    })

    expect(booking.id).toEqual(expect.any(String))
  })
})
