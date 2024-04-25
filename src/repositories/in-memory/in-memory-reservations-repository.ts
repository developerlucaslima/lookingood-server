import { Reservation, Prisma, Status } from '@prisma/client'
import { ReservationsRepository } from '../reservations-repository'
import { randomUUID } from 'crypto'

export class InMemoryReservationsRepository implements ReservationsRepository {
  public items: Map<Reservation['id'], Reservation> = new Map()

  async create(data: Prisma.ReservationUncheckedCreateInput) {
    const reservation: Reservation = {
      id: randomUUID(),
      status: data.status as Status,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      professionalId: data.professionalId,
      serviceId: data.serviceId,
      userId: data.userId,
      establishmentId: data.establishmentId,
    }
    this.items.set(reservation.id, reservation)

    return reservation
  }

  async update(reservation: Reservation) {
    if (this.items.has(reservation.id)) {
      this.items.set(reservation.id, reservation)
    }

    return reservation
  }

  async findManyByUserId(userId: string) {
    const reservations: Reservation[] = []
    for (const reservation of this.items.values()) {
      if (reservation.userId === userId) {
        reservations.push(reservation)
      }
    }

    return reservations
  }

  async isReservationConflict(
    professionalId: string,
    startTime: Date,
    endTime: Date,
  ) {
    let conflict = false
    for (const reservation of this.items.values()) {
      const isSameProfessional = reservation.professionalId === professionalId
      const isStartTimeOverlap =
        startTime >= reservation.startTime && startTime < reservation.endTime
      const isEndTimeOverlap =
        endTime > reservation.startTime && endTime <= reservation.endTime
      const isIntervalOverlap =
        startTime <= reservation.startTime && endTime >= reservation.endTime
      if (
        isSameProfessional &&
        (isStartTimeOverlap || isEndTimeOverlap || isIntervalOverlap)
      ) {
        conflict = true
      }
    }

    return conflict
  }

  async findManyByStatus(status: string) {
    const reservations: Reservation[] = []
    for (const reservation of this.items.values()) {
      if (reservation.status === status) {
        reservations.push(reservation)
      }
    }
    return reservations
  }

  async findById(id: string) {
    return this.items.get(id) || null
  }
}
