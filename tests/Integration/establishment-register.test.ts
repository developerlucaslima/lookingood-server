import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { EstablishmentRegisterUseCase } from '@/use-cases/establishment-register'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'

let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: EstablishmentRegisterUseCase

describe('Establishment Register Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    sut = new EstablishmentRegisterUseCase(establishmentsRepository)
  })

  it('should be able to register', async () => {
    const { establishment } = await sut.execute({
      name: 'Barber-01',
      description: 'Best barber of the city',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'barber01@example.com',
      password: '123456',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(establishment.id).toEqual(expect.any(String))
  })

  it('should hash establishment password upon registration', async () => {
    const { establishment } = await sut.execute({
      name: 'Barber-01',
      description: 'Best barber of the city',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'barber01@example.com',
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

  it('should not be able to register with same email twice', async () => {
    const email = 'barber01@example.com'

    await sut.execute({
      name: 'Barber-01',
      description: 'Best barber of the city',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email,
      password: '123456',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await expect(() =>
      sut.execute({
        name: 'Barber-01',
        description: 'Best barber of the city',
        phone: '55 555-5555',
        imageUrl: 'image.url',
        email,
        password: '123456',
        latitude: -27.2092052,
        longitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
