import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { EstablishmentProfileUseCase } from '@/use-cases/establishment-profile'

let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: EstablishmentProfileUseCase

describe('Establishment Profile Use Case', () => {
  beforeEach(async () => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    sut = new EstablishmentProfileUseCase(establishmentsRepository)

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
  })

  it('should allow get establishment profile', async () => {
    const { establishment } = await sut.execute({
      establishmentId: 'Establishment-01',
    })

    expect(establishment.id).toEqual(expect.any(String))
  })

  it('should prevent get establishment profile if establishment does not exist', async () => {
    await expect(
      sut.execute({
        establishmentId: 'Nonexistent-Establishment-01', // invalid establishment
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })
})
