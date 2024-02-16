import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Booking } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { BookingRepository } from '@/repositories/bookings-repository'

interface BookingServiceUseCaseRequest {
  date: Date
  status: string
  userId: string
  serviceId: string
  establishmentId: string
}

interface BookingServicesUseCaseResponse {
  booking: Booking
}

export class BookingServiceUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private bookingRepository: BookingRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    date,
    status,
    userId,
    serviceId,
    establishmentId,
  }: BookingServiceUseCaseRequest): Promise<BookingServicesUseCaseResponse> {
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)

    if (!establishment) {
      throw new ResourceNotFoundError()
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const booking = await this.bookingRepository.create({
      date,
      status,
      userId,
      serviceId,
      establishmentId,
    })

    return {
      booking,
    }
  }
}
