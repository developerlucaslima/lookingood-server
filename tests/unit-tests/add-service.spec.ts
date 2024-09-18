import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { InvalidGenderException } from '@/errors/invalid-gender.exception'
import { InvalidServiceDurationException } from '@/errors/invalid-service-duration.exception'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { AddServiceUseCase } from '@/use-cases/add-service'

let establishmentsRepository: InMemoryEstablishmentsRepository
let servicesRepository: InMemoryServicesRepository
let sut: AddServiceUseCase

describe('Add Service Use Case', () => {
	beforeEach(async () => {
		establishmentsRepository = new InMemoryEstablishmentsRepository()
		servicesRepository = new InMemoryServicesRepository()
		sut = new AddServiceUseCase(establishmentsRepository, servicesRepository)

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

	it('should allow add service', async () => {
		const { service } = await sut.execute({
			name: 'Haircut',
			price: 20,
			genderFor: 'BOTH',
			description: 'Standard haircut',
			imageUrl: 'haircut.jpg',
			modificationDeadlineMinutes: 60,
			establishmentId: 'Establishment-01',
			durationMinutes: 30,
		})

		expect(service.id).toEqual(expect.any(String))
	})

	it('should prevent add service if the establishment does not exist', async () => {
		await expect(() =>
			sut.execute({
				name: 'Haircut',
				price: 20,
				genderFor: 'MALE',
				description: 'Standard haircut',
				imageUrl: 'haircut.jpg',
				modificationDeadlineMinutes: 60,
				establishmentId: 'Nonexistent-Establishment-01', // invalid establishment
				durationMinutes: 30,
			}),
		).rejects.toBeInstanceOf(EstablishmentNotFoundException)
	})

	it('should prevent adding a service if the duration is not a multiple of 15 minutes', async () => {
		await expect(
			sut.execute({
				name: 'Haircut',
				price: 20,
				genderFor: 'FEMALE',
				description: 'Standard haircut',
				imageUrl: 'haircut.jpg',
				modificationDeadlineMinutes: 60,
				establishmentId: 'Establishment-01',
				durationMinutes: 31, // invalid duration
			}),
		).rejects.toBeInstanceOf(InvalidServiceDurationException)
	})

	it('should prevent add service if gender is not valid', async () => {
		await expect(
			sut.execute({
				name: 'Haircut',
				price: 20,
				genderFor: 'INVALID_GENDER' as 'MALE', // invalid gender
				description: 'Standard haircut',
				imageUrl: 'haircut.jpg',
				modificationDeadlineMinutes: 60,
				establishmentId: 'Establishment-01',
				durationMinutes: 30,
			}),
		).rejects.toBeInstanceOf(InvalidGenderException)
	})
})
