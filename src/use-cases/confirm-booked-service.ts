import { Booking } from '@prisma/client'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { EstablishmentNotFoundError } from './errors/establishment-not-found-error'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'

interface ConfirmBookedServiceUseCaseRequest {
  bookingId: string
  establishmentId: string
}

interface ConfirmBookedServicesUseCaseResponse {
  booking: Booking
}

export class ConfirmBookedServiceUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private establishmentsRepository: EstablishmentsRepository,
  ) {}

  async execute({
    bookingId,
    establishmentId,
  }: ConfirmBookedServiceUseCaseRequest): Promise<ConfirmBookedServicesUseCaseResponse> {
    // it should retrieve the booking by its ID
    const booking = await this.bookingsRepository.findById(bookingId)

    // it shouldn't be possible to confirm a booking if the booking doesn't exist
    if (!booking) {
      throw new ResourceNotFoundError()
    }

    // it shouldn't be possible to confirm a booking if the establishment doesn't exist or doesn't match the booking's establishment
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment || establishment.id !== booking.establishmentId) {
      throw new EstablishmentNotFoundError()
    }

    // it should confirm the booking
    booking.status = `CONFIRMED`

    // it should update the booking status
    await this.bookingsRepository.update(booking)

    // it should return the confirmed booking
    return {
      booking,
    }
  }
}
