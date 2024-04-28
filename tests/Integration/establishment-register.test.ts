import { expect, describe, it, beforeEach } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { EstablishmentRegisterUseCase } from '@/use-cases/establishment-register'
import { EmailNotAvailableException } from '@/use-cases/errors/409-email-not-available-exception.ts'
import { Decimal } from '@prisma/client/runtime/library'

let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: EstablishmentRegisterUseCase

describe('Establishment Register Use Case', () => {
  beforeEach(async () => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    sut = new EstablishmentRegisterUseCase(establishmentsRepository)

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

  it('should allow to register a establishment', async () => {
    const { establishment } = await sut.execute({
      name: 'Salon',
      description: 'Salon under registration...',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'salon@example.com',
      password: '123456',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(establishment.id).toEqual(expect.any(String))
  })

  it('should hash establishment password upon registration', async () => {
    const { establishment } = await sut.execute({
      name: 'Salon',
      description: 'Salon under registration...',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'salon@example.com',
      password: '123456',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      establishment.passwordHash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should prevent a establishment register with a duplicate email', async () => {
    await expect(() =>
      sut.execute({
        name: 'Salon',
        description: 'Salon under registration...',
        phone: '55 555-5555',
        imageUrl: 'image.url',
        email: 'registered_establishment@example.com', // invalid email
        password: '123456',
        latitude: -27.2092052,
        longitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(EmailNotAvailableException)
  })
})
