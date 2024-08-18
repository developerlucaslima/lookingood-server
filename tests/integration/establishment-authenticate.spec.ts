import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InvalidCredentialsException } from '@/errors/invalid-credentials.exception'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { EstablishmentAuthenticateUseCase } from '@/use-cases/establishment-authenticate'

let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: EstablishmentAuthenticateUseCase

describe('Establishment Authenticate Use Case', () => {
  beforeEach(async () => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    sut = new EstablishmentAuthenticateUseCase(establishmentsRepository)

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

  it('should allow establishment authenticate', async () => {
    const { establishment } = await sut.execute({
      email: 'registered_establishment@example.com',
      password: '123456',
    })
    expect(establishment.id).toEqual(expect.any(String))
  })

  it('should prevent establishment authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong_email@example.com', // invalid email
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })

  it('should prevent establishment authenticate with wrong password', async () => {
    await expect(() =>
      sut.execute({
        email: 'registered_establishment@example.com', // invalid password
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })
})
