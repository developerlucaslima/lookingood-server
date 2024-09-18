import type { Booking, Prisma } from '@prisma/client'

export interface BookingsRepository {
	create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking>
	findById(id: string): Promise<Booking | null>
	update(data: Prisma.BookingUncheckedCreateInput): Promise<Booking>
	findManyByUserId(userId: string): Promise<Booking[] | null>
	isBookingConflict(professionalId: string, startTime: Date, endTime: Date): Promise<boolean>
	findManyByStatus(status: string): Promise<Booking[] | null>
}

// findByProfessionalAndDate
// findByDate
// findByProfessionalAndPeriod
// findByPeriod
