import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository'
import { AddProfessionalUseCase } from '@/use-cases/add-professional'

let establishmentsRepository: InMemoryEstablishmentsRepository
let professionalsRepository: InMemoryProfessionalsRepository
let sut: AddProfessionalUseCase

describe('Add Professional Use Case', () => {
  beforeEach(async () => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    professionalsRepository = new InMemoryProfessionalsRepository()
    sut = new AddProfessionalUseCase(
      establishmentsRepository,
      professionalsRepository,
    )

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

  it('should allow add professional', async () => {
    const { professional } = await sut.execute({
      name: 'John Doe',
      imageUrl: 'image.url',
      establishmentId: 'Establishment-01',
    })

    expect(professional.id).toEqual(expect.any(String))
  })

  it('should prevent add professional if the establishment does not exist', async () => {
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        imageUrl: 'image.url',
        establishmentId: 'Nonexistent-Establishment-01', // invalid establishment
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })
})
