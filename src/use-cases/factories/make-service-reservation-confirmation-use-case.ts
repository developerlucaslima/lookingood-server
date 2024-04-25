import { PrismaReservationsRepository } from '@/repositories/prisma/prisma-reservations-repository'
import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { ServiceReservationConfirmationUseCase } from '../service-reservation-confirmation'

export function MakeServiceReservationConfirmationUseCase() {
  const reservationsRepository = new PrismaReservationsRepository()
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const serviceReservationConfirmationUseCase =
    new ServiceReservationConfirmationUseCase(
      reservationsRepository,
      establishmentsRepository,
    )

  return serviceReservationConfirmationUseCase
}
