import { Booking } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { BookingsRepository } from '@/repositories/bookings-repository'

interface ConfirmBookingServiceUseCaseRequest {
  bookingId: string
}

interface ConfirmBookingServicesUseCaseResponse {
  booking: Booking
}

export class ConfirmBookingServiceUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({
    bookingId,
  }: ConfirmBookingServiceUseCaseRequest): Promise<ConfirmBookingServicesUseCaseResponse> {
    const booking = await this.bookingsRepository.findById(bookingId)

    if (!booking) {
      throw new ResourceNotFoundError()
    }

    booking.status = `Confirmed`

    await this.bookingsRepository.update(booking)

    return {
      booking,
    }
  }
}
