import { Booking } from '@prisma/client'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { isAvailableToChange } from '../utils/minutes-later'
import { IsNotAvailableToChange } from '../errors/is-not-available-to-change'
import { BookingNotFoundError } from '../errors/booking-not-found-error'
import { ServicesRepository } from '@/repositories/services-repository'
import { ServiceNotFoundError } from '../errors/service-not-found-error '
import { getEndTimeByStartTime } from '../utils/get-end-time-by-start-time'
import { UsersRepository } from '@/repositories/users-repository'
import { UserNotFoundError } from '../errors/user-not-found-error '
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { SchedulesRepository } from '@/repositories/schedule-repository'
import { EstablishmentNotFoundError } from '../errors/establishment-not-found-error'
import { HourNotAvailable } from '../errors/hour-not-available'
import { InvalidTimetableError } from '../errors/invalid-timetable-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { checkOperatingHours } from '../utils/check-operating-hours'
import { getDayOfWeekName } from '../utils/get-day-of-week-name'
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error'

interface ChangeBookedServiceUseCaseRequest {
  startTime: Date
  serviceId: string
  bookingId: string
}

interface ChangeBookedServicesUseCaseResponse {
  booking: Booking
}

export class ChangeBookedServiceUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
    private servicesRepository: ServicesRepository,
    private schedulesRepository: SchedulesRepository,
    private bookingsRepository: BookingsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    startTime,
    serviceId,
    bookingId,
  }: ChangeBookedServiceUseCaseRequest): Promise<ChangeBookedServicesUseCaseResponse> {
    let endTime = null

    const booking = await this.bookingsRepository.findById(bookingId)
    if (!booking) {
      throw new BookingNotFoundError()
    }

    const user = await this.usersRepository.findById(booking.userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundError()
    }
    endTime = getEndTimeByStartTime(startTime, service.durationMinutes)

    const modificationDeadlineMinutes = service.modificationDeadlineMinutes
    if (!isAvailableToChange(booking.startTime, modificationDeadlineMinutes)) {
      throw new IsNotAvailableToChange()
    }

    const professional = await this.professionalsRepository.findById(
      booking.professionalId,
    )
    if (!professional) {
      throw new ProfessionalNotFoundError()
    }

    const establishment = await this.establishmentsRepository.findById(
      service.establishmentId,
    )
    if (!establishment) {
      throw new EstablishmentNotFoundError()
    }

    if (service.establishmentId !== professional.establishmentId) {
      throw new ResourceNotFoundError()
    }

    const conflicts = await this.bookingsRepository.isBookingConflict(
      booking.professionalId,
      startTime,
      endTime,
    )
    if (conflicts) {
      throw new InvalidTimetableError()
    }

    const schedule = await this.schedulesRepository.findByEstablishmentId(
      service.establishmentId,
    )
    if (!schedule) {
      throw new ServiceNotFoundError()
    }

    const dayOfWeek = getDayOfWeekName(startTime)
    const isWithinOperatingHours = checkOperatingHours(
      schedule,
      dayOfWeek,
      startTime,
      endTime,
    )
    if (!isWithinOperatingHours) {
      throw new HourNotAvailable()
    }

    booking.startTime = startTime
    booking.endTime = endTime
    booking.status = 'Waiting for confirmation'
    booking.serviceId = serviceId

    await this.bookingsRepository.update(booking)

    return {
      booking,
    }
  }
}
