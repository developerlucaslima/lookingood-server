import { Booking } from '@prisma/client'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { MismatchResourcesException } from '@/errors/mismatch-resources.exception'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'

import { BookingNotFoundException } from '../errors/booking-not-found.exception'

interface ConfirmBookingServiceUseCaseRequest {
  bookingId: string
  establishmentId: string
}

interface ConfirmBookingServicesUseCaseResponse {
  booking: Booking
}

export class ConfirmBookingServiceUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private establishmentsRepository: EstablishmentsRepository,
  ) {}

  async execute({
    bookingId,
    establishmentId,
  }: ConfirmBookingServiceUseCaseRequest): Promise<ConfirmBookingServicesUseCaseResponse> {
    // It should prevent service booking confirmation if the booking does not exist
    const booking = await this.bookingsRepository.findById(bookingId)
    if (!booking) {
      throw new BookingNotFoundException()
    }

    // It should prevent service confirmation update if the establishment does not exist
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // It should prevent service booking confirmation if the establishment does not match the booking
    if (establishmentId !== booking.establishmentId) {
      throw new MismatchResourcesException()
    }

    // It should allow service booking confirmation.
    booking.status = 'CONFIRMED'
    await this.bookingsRepository.update(booking)
    return {
      booking,
    }
  }
}
