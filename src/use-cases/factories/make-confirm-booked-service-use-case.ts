import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository'
import { ConfirmBookedServiceUseCase } from '../confirm-booked-service'

export function makeConfirmBookedServicesUseCase() {
  const bookingsRepository = new PrismaBookingsRepository()
  const confirmBookedServiceUseCase = new ConfirmBookedServiceUseCase(
    bookingsRepository,
  )

  return confirmBookedServiceUseCase
}
