import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { $Enums, ProfessionalSchedule } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { compareSchedules } from '@/utils/compare-schedules'
import { ProfessionalNotFoundException } from './errors/404-professional-not-found-exception'
import { InvalidInputParametersException } from './errors/400-invalid-input-parameters-exception'
import { EstablishmentsSchedulesRepository } from '@/repositories/establishments-schedules-repository'
import { ProfessionalsSchedulesRepository } from '@/repositories/professionals-schedules-repository'
import { InvalidScheduleException } from './errors/422-invalid-schedule-exception'
import { UnauthorizedEstablishmentException } from './errors/401-unauthorized-establishment-exception'

interface AddProfessionalScheduleUseCaseRequest {
  startTime: string
  minutesWorking: number
  breakTime: string | null
  minutesBreak: number | null
  weekDay: $Enums.WeekDay
  professionalId: string
}

interface AddProfessionalScheduleUseCaseResponse {
  schedule: ProfessionalSchedule
}

export class AddProfessionalScheduleUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private professionalSchedulesRepository: ProfessionalsSchedulesRepository,
    private establishmentsRepository: EstablishmentsRepository,
    private establishmentSchedulesRepository: EstablishmentsSchedulesRepository,
  ) {}

  async execute({
    startTime,
    minutesWorking,
    breakTime,
    minutesBreak,
    weekDay,
    professionalId,
  }: AddProfessionalScheduleUseCaseRequest): Promise<AddProfessionalScheduleUseCaseResponse> {
    // It should prevent add professional schedule if the professional does not exist.
    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundException()
    }

    // It should prevent add professional schedule if the establishment does not exist.
    const establishment = await this.establishmentsRepository.findById(
      professional.establishmentId,
    )
    if (!establishment) {
      throw new UnauthorizedEstablishmentException('unauthenticated')
    }

    // It should prevent add professional schedule with break if it have not break start or end time.
    if ((!breakTime && minutesBreak) || (breakTime && !minutesBreak)) {
      throw new InvalidScheduleException('invalid_break')
    }

    // It should prevent add professional schedule with negative time parameters.
    if (minutesWorking < 0 || (breakTime && minutesBreak && minutesBreak < 0)) {
      throw new InvalidInputParametersException('negative')
    }

    // It should prevent add professional schedule if the establishment does not have opening hours for the given weekday.
    const establishmentSchedule =
      await this.establishmentSchedulesRepository.findByEstablishmentIdAndWeekDay(
        establishment.id,
        weekDay,
      )
    if (!establishmentSchedule) {
      throw new InvalidScheduleException('establishment_no_schedule')
    }

    // It should prevent add professional schedule if the professional's schedule conflicts with the establishment's schedule.
    if (weekDay === establishmentSchedule.weekDay) {
      const isCompatibleSchedules = compareSchedules(
        startTime,
        minutesWorking,
        breakTime,
        minutesBreak,
        establishmentSchedule.startTime,
        establishmentSchedule.minutesWorking,
        establishmentSchedule.breakTime,
        establishmentSchedule.minutesBreak,
      )
      if (!isCompatibleSchedules) {
        throw new InvalidScheduleException('mismatched')
      }
    }

    // It should allow add professional schedule.
    const schedule = await this.professionalSchedulesRepository.create({
      startTime,
      minutesWorking,
      breakTime,
      minutesBreak,
      weekDay,
      professionalId,
    })
    return { schedule }
  }
}
