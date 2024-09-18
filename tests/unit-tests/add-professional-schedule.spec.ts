import type { WeekDay } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { InvalidInputParametersException } from '@/errors/invalid-input-parameters.exception'
import { InvalidScheduleException } from '@/errors/invalid-schedule.exception'
import { ProfessionalNotFoundException } from '@/errors/professional-not-found.exception'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryEstablishmentsSchedulesRepository } from '@/repositories/in-memory/in-memory-establishments-schedules-repository'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository'
import { InMemoryProfessionalsSchedulesRepository } from '@/repositories/in-memory/in-memory-professionals-schedules-repository'
import { AddProfessionalScheduleUseCase } from '@/use-cases/add-professional-schedule'

let professionalsRepository: InMemoryProfessionalsRepository
let professionalSchedulesRepository: InMemoryProfessionalsSchedulesRepository
let establishmentsRepository: InMemoryEstablishmentsRepository
let establishmentSchedulesRepository: InMemoryEstablishmentsSchedulesRepository
let sut: AddProfessionalScheduleUseCase

describe('Add Professional Schedule Use Case', () => {
	beforeEach(async () => {
		professionalsRepository = new InMemoryProfessionalsRepository()
		establishmentsRepository = new InMemoryEstablishmentsRepository()
		professionalSchedulesRepository = new InMemoryProfessionalsSchedulesRepository()
		establishmentsRepository = new InMemoryEstablishmentsRepository()
		establishmentSchedulesRepository = new InMemoryEstablishmentsSchedulesRepository()
		sut = new AddProfessionalScheduleUseCase(
			professionalsRepository,
			professionalSchedulesRepository,
			establishmentsRepository,
			establishmentSchedulesRepository,
		)

		// Establishment 01 -------------------
		const establishmentId = 'Establishment-01'
		establishmentsRepository.items.set(establishmentId, {
			id: establishmentId,
			name: 'Registered Establishment',
			description: 'Registered establishment...',
			phone: '55 555-5555',
			imageUrl: 'image.url',
			email: 'registered_establishment@example.com',
			passwordHash: await hash('123456', 6),
			createdAt: new Date(),
			latitude: new Decimal(-27.2092052),
			longitude: new Decimal(-49.6401091),
			role: 'ESTABLISHMENT',
		})

		// Establishment Schedule 01 -------------------
		const establishmentSchedule = [
			{ weekDay: 'MONDAY' as WeekDay, id: 'Monday-Schedule' },
			{ weekDay: 'TUESDAY' as WeekDay, id: 'Tuesday-Schedule' },
			{ weekDay: 'WEDNESDAY' as WeekDay, id: 'Wednesday-Schedule' },
			{ weekDay: 'THURSDAY' as WeekDay, id: 'Thursday-Schedule' },
			{ weekDay: 'FRIDAY' as WeekDay, id: 'Friday-Schedule' },
			{ weekDay: 'SATURDAY' as WeekDay, id: 'Saturday-Schedule' },
			// { weekDay: 'SUNDAY' as WeekDay, id: 'Sunday-Schedule' },
		]
		for (const { weekDay, id } of establishmentSchedule) {
			establishmentSchedulesRepository.items.set(id, {
				id,
				startTime: '08:00',
				minutesWorking: 600,
				breakTime: '12:00',
				minutesBreak: 60,
				weekDay,
				establishmentId,
			})
		}

		// Professional 01 -------------------
		const professionalId = 'Professional-01'
		professionalsRepository.items.set(professionalId, {
			id: professionalId,
			name: 'Registered Professional',
			imageUrl: 'image.url',
			establishmentId: 'Establishment-01',
		})

		// Professional 02 -------------------
		const professionalId02 = 'Professional-02'
		professionalsRepository.items.set(professionalId02, {
			id: professionalId02,
			name: 'Registered Professional',
			imageUrl: 'image.url',
			establishmentId: 'Establishment-02',
		})
	})

	it('should allow add professional schedule', async () => {
		const { schedule } = await sut.execute({
			startTime: '08:00',
			minutesWorking: 480,
			breakTime: '12:00',
			minutesBreak: 60,
			weekDay: 'MONDAY',
			professionalId: 'Professional-01',
		})

		expect(schedule.id).toEqual(expect.any(String))
	})

	it('should prevent add professional schedule if the professional does not exist', async () => {
		await expect(() =>
			sut.execute({
				startTime: '08:00',
				minutesWorking: 480,
				breakTime: '12:00',
				minutesBreak: 90,
				weekDay: 'MONDAY',
				professionalId: 'Nonexistent-Professional-01', // invalid professional
			}),
		).rejects.toBeInstanceOf(ProfessionalNotFoundException)
	})

	it('should prevent add professional schedule if the establishment does not exist', async () => {
		await expect(() =>
			sut.execute({
				startTime: '08:00',
				minutesWorking: 480,
				breakTime: '12:00',
				minutesBreak: 90,
				weekDay: 'MONDAY',
				professionalId: 'Professional-02', // professional from invalid establishment
			}),
		).rejects.toBeInstanceOf(EstablishmentNotFoundException)
	})

	it('should prevent add professional schedule with break if it have not break start or end time.', async () => {
		await expect(() =>
			sut.execute({
				startTime: '08:00',
				minutesWorking: 480,
				breakTime: '12:00',
				minutesBreak: null, // invalid minutes
				weekDay: 'MONDAY',
				professionalId: 'Professional-01',
			}),
		).rejects.toBeInstanceOf(InvalidScheduleException)
	})

	it('should prevent add professional schedule with negative time parameters', async () => {
		await expect(() =>
			sut.execute({
				startTime: '08:00',
				minutesWorking: -480, // invalid minutes
				breakTime: '12:00',
				minutesBreak: 90,
				weekDay: 'MONDAY',
				professionalId: 'Professional-01',
			}),
		).rejects.toBeInstanceOf(InvalidInputParametersException)
	})

	it('should prevent add professional schedule if the establishment does not have opening hours for the given weekday', async () => {
		await expect(() =>
			sut.execute({
				startTime: '08:00',
				minutesWorking: 480,
				breakTime: '12:00',
				minutesBreak: 60,
				weekDay: 'SUNDAY', // invalid day for this establishment
				professionalId: 'Professional-01',
			}),
		).rejects.toBeInstanceOf(InvalidScheduleException)
	})

	it("should prevent add professional schedule if the professional's schedule conflicts with the establishment's schedule", async () => {
		await expect(() =>
			sut.execute({
				startTime: '08:00',
				minutesWorking: 480,
				breakTime: '12:00',
				minutesBreak: 30, // invalid minutes
				weekDay: 'MONDAY',
				professionalId: 'Professional-01',
			}),
		).rejects.toBeInstanceOf(InvalidScheduleException)
	})
})
