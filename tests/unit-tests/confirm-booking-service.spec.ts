import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { BookingNotFoundException } from '@/errors/booking-not-found.exception'
import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { MismatchResourcesException } from '@/errors/mismatch-resources.exception'
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { ConfirmBookingServiceUseCase } from '@/use-cases/confirm-booking-service'

let bookingsRepository: InMemoryBookingsRepository
let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: ConfirmBookingServiceUseCase

describe('Confirm Booking Service Use Case', () => {
	beforeEach(async () => {
		bookingsRepository = new InMemoryBookingsRepository()
		establishmentsRepository = new InMemoryEstablishmentsRepository()
		sut = new ConfirmBookingServiceUseCase(bookingsRepository, establishmentsRepository)

		// Booking 01 -------------------
		const bookingId = 'Booking-01'
		bookingsRepository.items.set(bookingId, {
			id: bookingId,
			status: 'WAITING_FOR_CONFIRMATION',
			startTime: new Date(2024, 1, 1, 9, 0, 0),
			endTime: new Date(2024, 1, 1, 9, 45, 0),
			professionalId: 'Professional-01',
			serviceId: 'Service-01',
			userId: 'User-01',
			establishmentId: 'Establishment-01',
		})

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

		// Establishment 02 -------------------
		const establishmentId02 = 'Establishment-02'
		establishmentsRepository.items.set(establishmentId02, {
			id: establishmentId02,
			name: 'Registered Establishment02',
			description: 'Registered establishment02...',
			phone: '55 555-5555',
			imageUrl: 'image.url',
			email: 'registered_establishment02@example.com',
			passwordHash: await hash('123456', 6),
			createdAt: new Date(),
			latitude: new Decimal(-27.2092052),
			longitude: new Decimal(-49.6401091),
			role: 'ESTABLISHMENT',
		})
	})

	it('should allow service booking confirmation', async () => {
		const { booking } = await sut.execute({
			bookingId: 'Booking-01',
			establishmentId: 'Establishment-01',
		})

		expect(booking.id).toEqual(expect.any(String))
	})

	it('should prevent service booking confirmation if the booking does not exist', async () => {
		await expect(
			sut.execute({
				bookingId: 'Nonexistent-Booking-01', // invalid booking
				establishmentId: 'Establishment-01',
			}),
		).rejects.toBeInstanceOf(BookingNotFoundException)
	})

	it('It should prevent service confirmation update if the establishment does not exist', async () => {
		await expect(
			sut.execute({
				bookingId: 'Booking-01',
				establishmentId: 'Nonexistent-Establishment-01', // invalid establishment
			}),
		).rejects.toBeInstanceOf(EstablishmentNotFoundException)
	})

	it('It should prevent service booking confirmation if the establishment does not match the booking', async () => {
		await expect(
			sut.execute({
				bookingId: 'Booking-01',
				establishmentId: 'Establishment-02', // invalid establishment
			}),
		).rejects.toBeInstanceOf(MismatchResourcesException)
	})
})
