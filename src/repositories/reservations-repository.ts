import { Reservation, Prisma } from '@prisma/client'

export interface ReservationsRepository {
  create(data: Prisma.ReservationUncheckedCreateInput): Promise<Reservation>
  findById(id: string): Promise<Reservation | null>
  update(data: Prisma.ReservationUncheckedCreateInput): Promise<Reservation>
  findManyByUserId(userId: string): Promise<Reservation[] | null>
  isReservationConflict(
    professionalId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean>
  findManyByStatus(status: string): Promise<Reservation[] | null>
}

// findByProfessionalAndDate
// findByDate
// findByProfessionalAndPeriod
// findByPeriod
