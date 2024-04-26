import { InMemoryReservationsRepository } from '@/repositories/in-memory/in-memory-reservations-repository'

export const reservationsSetup = async (
  reservationsRepository: InMemoryReservationsRepository,
) => {
  const haircutReservationId = 'Reservation-01'
  reservationsRepository.items.set(haircutReservationId, {
    id: haircutReservationId,
    status: 'WAITING_FOR_CONFIRMATION',
    startTime: new Date(2024, 1, 1, 9, 0, 0),
    endTime: new Date(2024, 1, 1, 9, 45, 0),
    professionalId: 'Professional-01',
    serviceId: 'Service-01',
    userId: 'User-01',
    establishmentId: 'Establishment-01',
  })

  const nailsReservationId = 'Reservation-02'
  reservationsRepository.items.set(nailsReservationId, {
    id: nailsReservationId,
    status: 'WAITING_FOR_CONFIRMATION',
    startTime: new Date(2024, 1, 1, 9, 0, 0),
    endTime: new Date(2024, 1, 1, 9, 45, 0),
    professionalId: 'Professional-02',
    serviceId: 'Service-02',
    userId: 'User-01',
    establishmentId: 'Establishment-01',
  })
}
