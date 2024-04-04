import { Booking } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { BookingsRepository } from '@/repositories/bookings-repository'

interface ConfirmBookedServiceUseCaseRequest {
  bookingId: string
}

interface ConfirmBookedServicesUseCaseResponse {
  booking: Booking
}

export class ConfirmBookedServiceUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({
    bookingId,
  }: ConfirmBookedServiceUseCaseRequest): Promise<ConfirmBookedServicesUseCaseResponse> {
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
