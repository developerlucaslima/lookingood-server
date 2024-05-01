import { ServicesRepository } from '@/repositories/services-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { getEndTimeByStartTime } from '@/utils/get-end-time-by-start-time'
import { ReservationsRepository } from '@/repositories/reservations-repository'
import { Reservation } from '@prisma/client'
import { ProfessionalNotFoundException } from './errors/404-professional-not-found-exception'
import { ReservationNotFoundException } from './errors/404-reservation-not-found-exception'
import { ResourceNotFoundException } from './errors/404-resource-not-found-exception'
import { ServiceNotFoundException } from './errors/404-service-not-found-exception'
import { isAvailableToUpdate } from '@/utils/is-available-to-change'
import { ModificationDeadlineExceededError } from './errors/422-modification-deadline-exceeded-exception'
import { TimetableNotAvailableException } from './errors/409-timetable-not-available-exception'
import { isWithinProfessionalsSchedule } from '@/utils/is-within-with-professionals-schedule'
import { ProfessionalsSchedulesRepository } from '@/repositories/professionals-schedules-repository'
import { getDayNameOfWeek } from '@/utils/get-day-name-of-week'
import { UnauthorizedUserException } from './errors/401-unauthorized-user-exception'

interface ServiceReservationUpdateUseCaseRequest {
  startTime: Date
  userId: string
  serviceId: string
  professionalId: string
  reservationId: string
}

interface ServiceReservationUpdatesUseCaseResponse {
  reservation: Reservation
}

export class ServiceReservationUpdateUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
    private professionalSchedulesRepository: ProfessionalsSchedulesRepository,
    private servicesRepository: ServicesRepository,
    private reservationsRepository: ReservationsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    startTime,
    userId,
    serviceId,
    professionalId,
    reservationId,
  }: ServiceReservationUpdateUseCaseRequest): Promise<ServiceReservationUpdatesUseCaseResponse> {
    // It should prevent service reservation update if the reservation does not exist.
    const reservation =
      await this.reservationsRepository.findById(reservationId)
    if (!reservation) {
      throw new ReservationNotFoundException()
    }

    // It should prevent service reservation update if the user does not exist.
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UnauthorizedUserException('unauthenticated')
    }

    // It should prevent service reservation update if the user does not match the reservation.
    if (userId !== reservation.userId) {
      throw new UnauthorizedUserException('unauthorized')
    }

    // It should prevent service reservation update if the service does not exist.
    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundException()
    }

    // It should prevent service reservation update if it's not within the modification deadline.
    const modificationDeadlineMinutes = service.modificationDeadlineMinutes
    if (
      !isAvailableToUpdate(reservation.startTime, modificationDeadlineMinutes)
    ) {
      throw new ModificationDeadlineExceededError()
    }

    // It should prevent service reservation update if the professional does not exist.
    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundException()
    }

    // It should prevent service reservation update if the establishment, professional and service does not match.
    const establishment = await this.establishmentsRepository.findById(
      service.establishmentId,
    )
    if (
      (establishment && establishment.id !== service.establishmentId) ||
      (establishment && establishment.id !== professional.establishmentId) ||
      service.establishmentId !== professional.establishmentId
    ) {
      throw new ResourceNotFoundException('mismatched')
    }

    // It should prevent service reservation update if there are conflicts in the professional's schedule.
    const endTime = getEndTimeByStartTime(startTime, service.durationMinutes)
    const conflicts = await this.reservationsRepository.isReservationConflict(
      professionalId,
      startTime,
      endTime,
    )
    if (conflicts) {
      throw new TimetableNotAvailableException('conflict')
    }

    // It should prevent service reservation update if the professional hasn't operating hours for the given time.
    const dayOfWeek = getDayNameOfWeek(startTime)
    const professionalSchedule =
      await this.professionalSchedulesRepository.findByProfessionalIdAndWeekDay(
        professionalId,
        dayOfWeek,
      )
    if (!professionalSchedule) {
      throw new TimetableNotAvailableException('professional_day_off')
    } else if (
      !isWithinProfessionalsSchedule(professionalSchedule, startTime, endTime)
    ) {
      throw new TimetableNotAvailableException('professional_no_working')
    }

    // It should allow service reservation update.
    reservation.startTime = startTime
    reservation.endTime = endTime
    reservation.professionalId = professionalId
    reservation.serviceId = serviceId
    reservation.status = 'WAITING_FOR_CONFIRMATION'
    await this.reservationsRepository.update(reservation)
    return {
      reservation,
    }
  }
}
