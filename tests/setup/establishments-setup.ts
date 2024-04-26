import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'

export const establishmentsSetup = async (
  establishmentsRepository: InMemoryEstablishmentsRepository,
) => {
  const barberId = 'Establishment-01'
  establishmentsRepository.items.set(barberId, {
    id: barberId,
    name: 'John Barber',
    description: 'Best barber of the city',
    phone: '55 555-5555',
    imageUrl: 'image.url',
    email: 'barber01@example.com',
    passwordHash: await hash('123456', 6),
    createdAt: new Date(),
    latitude: new Decimal(-27.2092052),
    longitude: new Decimal(-49.6401091),
    role: 'ESTABLISHMENT',
  })

  const spaId = 'Establishment-02'
  establishmentsRepository.items.set(spaId, {
    id: spaId,
    name: 'Relax Spa',
    description: 'Relaxation and wellness spa',
    phone: '55 555-5556',
    imageUrl: 'image.url',
    email: 'spa@example.com',
    passwordHash: await hash('123456', 6),
    createdAt: new Date(),
    latitude: new Decimal(-27.2093052),
    longitude: new Decimal(-49.6402091),
    role: 'ESTABLISHMENT',
  })
}
