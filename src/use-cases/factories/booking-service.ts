import { UsersRepository } from '@/repositories/users-repository'
import { Booking } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error'
import { ServiceNotFoundError } from '../errors/service-not-found-error '
import { UserNotFoundError } from '../errors/user-not-found-error '
import { EstablishmentNotFoundError } from '../errors/establishment-not-found-error'
import { SchedulesRepository } from '@/repositories/schedules-repository'
import { ServicesRepository } from '@/repositories/services-repository'
import { InvalidTimetableError } from '../errors/invalid-timetable-error'
import { checkOperatingHours } from '../utils/check-operating-hours'
import { HourNotAvailable } from '../errors/hour-not-available'
import { getDayOfWeekName } from '../utils/get-day-of-week-name'
import { getEndTimeByStartTime } from '../utils/get-end-time-by-start-time'

interface BookingServiceUseCaseRequest {
  startTime: Date
  userId: string
  serviceId: string
  professionalId: string
}

interface BookingServicesUseCaseResponse {
  booking: Booking
}

export class BookingServiceUseCase {
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
    userId,
    serviceId,
    professionalId,
  }: BookingServiceUseCaseRequest): Promise<BookingServicesUseCaseResponse> {
    let endTime = null

    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundError()
    }

    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundError()
    }
    endTime = getEndTimeByStartTime(startTime, service.durationMinutes)

    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
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
      professionalId,
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

    const booking = await this.bookingsRepository.create({
      startTime,
      endTime,
      status: 'Waiting for confirmation',
      userId,
      serviceId,
      professionalId,
    })

    return {
      booking,
    }
  }
}
