import { Booking } from '@prisma/client'

import { MismatchResourcesException } from '@/errors/mismatch-resources.exception'
import { ProfessionalNotAvailableException } from '@/errors/professional-not-available.exception'
import { UserNotFoundException } from '@/errors/user-not-found.exception'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { ProfessionalsSchedulesRepository } from '@/repositories/professionals-schedules-repository'
import { ServicesRepository } from '@/repositories/services-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { getDayNameOfWeek } from '@/utils/get-day-name-of-week'
import { getEndTimeByStartTime } from '@/utils/get-end-time-by-start-time'
import { isBookingWithinProfessionalSchedule } from '@/utils/is-booking-within-professional-schedule'

import { EstablishmentNotFoundException } from '../errors/establishment-not-found.exception'
import { ProfessionalNotFoundException } from '../errors/professional-not-found.exception'
import { ServiceNotFoundException } from '../errors/service-not-found.exception'
import { TimetableNotAvailableException } from '../errors/timetable-not-available.exception'

interface BookingServiceUseCaseRequest {
  startTime: Date
  userId: string
  serviceId: string
  professionalId: string
  establishmentId: string
}

interface BookingServicesUseCaseResponse {
  booking: Booking
}

export class BookingServiceUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
    private professionalSchedulesRepository: ProfessionalsSchedulesRepository,
    private servicesRepository: ServicesRepository,
    private bookingsRepository: BookingsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    startTime,
    userId,
    serviceId,
    professionalId,
    establishmentId,
  }: BookingServiceUseCaseRequest): Promise<BookingServicesUseCaseResponse> {
    // It should prevent service booking if professional does not exist.
    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundException()
    }

    // It should prevent service booking if service does not exist.
    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundException()
    }
    const endTime = getEndTimeByStartTime(startTime, service.durationMinutes)

    // It should prevent service booking if user does not exist.
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundException()
    }

    // It should prevent service booking if establishment does not exist.
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // It should prevent service booking if the establishment, professional, and service do not match.
    if (
      establishmentId !== service.establishmentId ||
      establishmentId !== professional.establishmentId ||
      service.establishmentId !== professional.establishmentId
    ) {
      throw new MismatchResourcesException()
    }

    // It should prevent service booking if there are conflicts in the professional's schedule.
    const conflicts = await this.bookingsRepository.isBookingConflict(
      professionalId,
      startTime,
      endTime,
    )
    if (conflicts) {
      throw new TimetableNotAvailableException()
    }

    // It should prevent service booking if the professional does not have operating hours for the given time.
    const dayOfWeek = getDayNameOfWeek(startTime)
    const professionalSchedule =
      await this.professionalSchedulesRepository.findByProfessionalIdAndWeekDay(
        professionalId,
        dayOfWeek,
      )
    if (!professionalSchedule) {
      throw new ProfessionalNotAvailableException()
    } else if (
      !isBookingWithinProfessionalSchedule(
        professionalSchedule,
        startTime,
        endTime,
      )
    ) {
      throw new ProfessionalNotAvailableException()
    }

    // It should allow service booking.
    const booking = await this.bookingsRepository.create({
      startTime,
      endTime,
      status: 'WAITING_FOR_CONFIRMATION',
      userId,
      serviceId,
      professionalId,
      establishmentId,
    })

    return {
      booking,
    }
  }
}
