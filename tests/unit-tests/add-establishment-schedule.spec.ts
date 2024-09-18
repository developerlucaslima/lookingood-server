import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { InvalidInputParametersException } from '@/errors/invalid-input-parameters.exception'
import { InvalidScheduleException } from '@/errors/invalid-schedule.exception'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryEstablishmentsSchedulesRepository } from '@/repositories/in-memory/in-memory-establishments-schedules-repository'
import { AddEstablishmentScheduleUseCase } from '@/use-cases/add-establishment-schedule'

let establishmentsRepository: InMemoryEstablishmentsRepository
let establishmentSchedulesRepository: InMemoryEstablishmentsSchedulesRepository
let sut: AddEstablishmentScheduleUseCase

describe('Add Establishment Schedule Use Case', () => {
	beforeEach(async () => {
		establishmentsRepository = new InMemoryEstablishmentsRepository()
		establishmentSchedulesRepository = new InMemoryEstablishmentsSchedulesRepository()
		sut = new AddEstablishmentScheduleUseCase(
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
	})

	it('should allow add establishment schedule', async () => {
		const { schedule } = await sut.execute({
			startTime: '08:00',
			minutesWorking: 480,
			breakTime: '12:00',
			minutesBreak: 90,
			weekDay: 'MONDAY',
			establishmentId: 'Establishment-01',
		})

		expect(schedule.id).toEqual(expect.any(String))
	})

	it('should prevent to add establishment schedule if the establishment does not exist', async () => {
		await expect(() =>
			sut.execute({
				startTime: '08:00',
				minutesWorking: 480,
				breakTime: '12:00',
				minutesBreak: 90,
				weekDay: 'MONDAY',
				establishmentId: 'Nonexistent-Establishment-01', // invalid establishment
			}),
		).rejects.toBeInstanceOf(EstablishmentNotFoundException)
	})

	it('should prevent add professional schedule with break if it have not break start or end time.', async () => {
		await expect(() =>
			sut.execute({
				startTime: '08:00',
				minutesWorking: 480,
				breakTime: null, // invalid break
				minutesBreak: 90,
				weekDay: 'MONDAY',
				establishmentId: 'Establishment-01',
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
				establishmentId: 'Establishment-01',
			}),
		).rejects.toBeInstanceOf(InvalidInputParametersException)
	})
})
