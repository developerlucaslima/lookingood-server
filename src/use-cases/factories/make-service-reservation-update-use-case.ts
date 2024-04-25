import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository'
import { PrismaReservationsRepository } from '@/repositories/prisma/prisma-reservations-repository'
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository copy'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaProfessionalSchedulesRepository } from '@/repositories/prisma/prisma-professional-schedules-repository'
import { ServiceReservationUpdateUseCase } from '../service-reservation-update'

export function MakeServiceReservationUpdateUseCase() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const professionalsRepository = new PrismaProfessionalsRepository()
  const servicesRepository = new PrismaServicesRepository()
  const professionalSchedulesRepository =
    new PrismaProfessionalSchedulesRepository()
  const reservationsRepository = new PrismaReservationsRepository()
  const usersRepository = new PrismaUsersRepository()

  const serviceReservationUpdateUseCase = new ServiceReservationUpdateUseCase(
    establishmentsRepository,
    professionalsRepository,
    professionalSchedulesRepository,
    servicesRepository,
    reservationsRepository,
    usersRepository,
  )

  return serviceReservationUpdateUseCase
}
