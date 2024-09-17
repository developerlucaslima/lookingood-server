import type { $Enums, EstablishmentSchedule } from '@prisma/client'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import type { EstablishmentsRepository } from '@/repositories/establishments-repository'
import type { EstablishmentsSchedulesRepository } from '@/repositories/establishments-schedules-repository'

import { InvalidInputParametersException } from '../errors/invalid-input-parameters.exception'
import { InvalidScheduleException } from '../errors/invalid-schedule.exception'

interface AddEstablishmentScheduleUseCaseRequest {
	startTime: string
	minutesWorking: number
	breakTime: string | null
	minutesBreak: number | null
	weekDay: $Enums.WeekDay
	establishmentId: string
}

interface AddEstablishmentScheduleUseCaseResponse {
	schedule: EstablishmentSchedule
}

export class AddEstablishmentScheduleUseCase {
	constructor(
		private establishmentsRepository: EstablishmentsRepository,
		private establishmentsSchedulesRepository: EstablishmentsSchedulesRepository,
	) {}

	async execute({
		startTime,
		minutesWorking,
		breakTime,
		minutesBreak,
		weekDay,
		establishmentId,
	}: AddEstablishmentScheduleUseCaseRequest): Promise<AddEstablishmentScheduleUseCaseResponse> {
		// it should prevent to add establishment schedule if the establishment does not exist.
		const establishment = await this.establishmentsRepository.findById(establishmentId)
		if (!establishment) {
			throw new EstablishmentNotFoundException()
		}

		// It should prevent add establishment schedule with break if it have not break start or end time.
		if ((!breakTime && minutesBreak) || (breakTime && !minutesBreak)) {
			throw new InvalidScheduleException()
		}

		// It should prevent add establishment schedule with negative time parameters.
		if (minutesWorking < 0 || (breakTime && minutesBreak && minutesBreak < 0)) {
			throw new InvalidInputParametersException()
		}

		// it should allow add establishment schedule.
		const schedule = await this.establishmentsSchedulesRepository.create({
			startTime,
			minutesWorking,
			breakTime,
			minutesBreak,
			weekDay,
			establishmentId,
		})
		return {
			schedule,
		}
	}
}
