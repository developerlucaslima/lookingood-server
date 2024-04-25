import { ServicesRepository } from '@/repositories/services-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { getEndTimeByStartTime } from '@/utils/get-end-time-by-start-time'
import { ReservationsRepository } from '@/repositories/reservations-repository'
import { Reservation } from '@prisma/client'
import { EstablishmentNotFoundException } from './errors/404-establishment-not-found-exception'
import { ProfessionalNotFoundException } from './errors/404-professional-not-found-exception'
import { ReservationNotFoundException } from './errors/404-reservation-not-found-exception'
import { ResourceNotFoundException } from './errors/404-resource-not-found-exception'
import { ServiceNotFoundException } from './errors/404-service-not-found-exception'
import { UserNotFoundException } from './errors/404-user-not-found-exception'
import { ProfessionalSchedulesRepository } from '@/repositories/professional-schedules-repository'
import { isAvailableToUpdate } from '@/utils/is-available-to-change'
import { ModificationDeadlineExceededError } from './errors/422-modification-deadline-exceeded-exception'
import { TimetableNotAvailableException } from './errors/409-timetable-not-available-exception'
import { isWithinProfessionalsSchedule } from '@/utils/is-within-with-professionals-schedule'

interface ServiceReservationUpdateUseCaseRequest {
  startTime: Date
  userId: string
  serviceId: string
  reservationId: string
}

interface ServiceReservationUpdatesUseCaseResponse {
  reservation: Reservation
}

export class ServiceReservationUpdateUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
    private professionalSchedulesRepository: ProfessionalSchedulesRepository,
    private servicesRepository: ServicesRepository,
    private reservationsRepository: ReservationsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    startTime,
    userId,
    serviceId,
    reservationId,
  }: ServiceReservationUpdateUseCaseRequest): Promise<ServiceReservationUpdatesUseCaseResponse> {
    // It shouldn't be possible to update a reservation if the reservation doesn't exist
    const reservation =
      await this.reservationsRepository.findById(reservationId)
    if (!reservation) {
      throw new ReservationNotFoundException()
    }

    // It shouldn't be possible to update a reservation if the user doesn't exist
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundException()
    }

    // It shouldn't be possible to update a reservation if the user doesn't match the reservation
    if (userId !== reservation.userId) {
      throw new UserNotFoundException(
        "You can't modify reservations that aren't yours.",
      )
    }

    // It shouldn't be possible to update a reservation if the service doesn't exist
    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundException()
    }

    // It shouldn't be possible to update a reservation if it's not within the modification deadline
    const modificationDeadlineMinutes = service.modificationDeadlineMinutes
    if (
      !isAvailableToUpdate(reservation.startTime, modificationDeadlineMinutes)
    ) {
      throw new ModificationDeadlineExceededError(
        undefined,
        reservation.startTime,
        modificationDeadlineMinutes,
      )
    }

    // It shouldn't be possible to update a reservation if the professional doesn't exist
    const professional = await this.professionalsRepository.findById(
      reservation.professionalId,
    )
    if (!professional) {
      throw new ProfessionalNotFoundException()
    }

    // It shouldn't be possible to update a reservation if the establishment doesn't exist
    const establishment = await this.establishmentsRepository.findById(
      service.establishmentId,
    )
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // It shouldn't be possible to update a reservation if the service's establishment doesn't match the professional's
    if (service.establishmentId !== professional.establishmentId) {
      throw new ResourceNotFoundException()
    }

    // It shouldn't be possible to update a reservation if there's a conflict in the professional's schedule
    const endTime = getEndTimeByStartTime(startTime, service.durationMinutes)
    const conflicts = await this.reservationsRepository.isReservationConflict(
      reservation.professionalId,
      startTime,
      endTime,
    )
    if (conflicts) {
      throw new TimetableNotAvailableException()
    }

    // It shouldn't be possible to update a reservation if the establishment doesn't have operating hours for the given time
    const professionalSchedule =
      await this.professionalSchedulesRepository.findByProfessionalId(
        reservation.professionalId,
      )
    if (!professionalSchedule) {
      throw new ServiceNotFoundException()
    } else if (
      !isWithinProfessionalsSchedule(professionalSchedule, startTime, endTime)
    ) {
      throw new TimetableNotAvailableException(
        undefined,
        undefined,
        `Timetable from ${startTime.toLocaleString()} to ${endTime.toLocaleString()} is outside of professional's working hours`,
      )
    }

    // It should update the reservation
    reservation.startTime = startTime
    reservation.endTime = endTime
    reservation.status = 'WAITING_FOR_CONFIRMATION'
    reservation.serviceId = serviceId

    await this.reservationsRepository.update(reservation)

    // It should return the updated reservation
    return {
      reservation,
    }
  }
}
