import { $Enums, ProfessionalSchedule } from '@prisma/client'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EstablishmentsSchedulesRepository } from '@/repositories/establishments-schedules-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { ProfessionalsSchedulesRepository } from '@/repositories/professionals-schedules-repository'
import { compareSchedules } from '@/utils/compare-schedules'

import { InvalidInputParametersException } from '../errors/invalid-input-parameters.exception'
import { InvalidScheduleException } from '../errors/invalid-schedule.exception'
import { ProfessionalNotFoundException } from '../errors/professional-not-found.exception'

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
      throw new EstablishmentNotFoundException()
    }

    // It should prevent add professional schedule with break if it have not break start or end time.
    if ((!breakTime && minutesBreak) || (breakTime && !minutesBreak)) {
      throw new InvalidScheduleException()
    }

    // It should prevent add professional schedule with negative time parameters.
    if (minutesWorking < 0 || (breakTime && minutesBreak && minutesBreak < 0)) {
      throw new InvalidInputParametersException()
    }

    // It should prevent add professional schedule if the establishment does not have opening hours for the given weekday.
    const establishmentSchedule =
      await this.establishmentSchedulesRepository.findByEstablishmentIdAndWeekDay(
        establishment.id,
        weekDay,
      )
    if (!establishmentSchedule) {
      throw new InvalidScheduleException()
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
        throw new InvalidScheduleException()
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
