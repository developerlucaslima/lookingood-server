import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository'
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository copy'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ServiceReservationUseCase } from '../service-reservation'
import { PrismaProfessionalSchedulesRepository } from '@/repositories/prisma/prisma-professional-schedules-repository'
import { PrismaReservationsRepository } from '@/repositories/prisma/prisma-reservations-repository'

export function makeServiceReservationUseCase() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const professionalsRepository = new PrismaProfessionalsRepository()
  const professionalSchedulesRepository =
    new PrismaProfessionalSchedulesRepository()
  const servicesRepository = new PrismaServicesRepository()
  const reservationsRepository = new PrismaReservationsRepository()
  const usersRepository = new PrismaUsersRepository()

  const serviceReservationUseCase = new ServiceReservationUseCase(
    establishmentsRepository,
    professionalsRepository,
    professionalSchedulesRepository,
    servicesRepository,
    reservationsRepository,
    usersRepository,
  )

  return serviceReservationUseCase
}
