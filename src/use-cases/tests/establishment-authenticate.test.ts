import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { EstablishmentAuthenticateUseCase } from '../factories/establishment-authenticate'

let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: EstablishmentAuthenticateUseCase

describe('Establishment Authenticate Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    sut = new EstablishmentAuthenticateUseCase(establishmentsRepository)
  })
  it('should be able to authenticate', async () => {
    await establishmentsRepository.create({
      name: 'Barber-01',
      description: 'Best barber of the city',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'barber01@example.com',
      passwordHash: await hash('123456', 6),
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    const { establishment } = await sut.execute({
      email: 'barber01@example.com',
      password: '123456',
    })

    expect(establishment.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await establishmentsRepository.create({
      name: 'Barber-01',
      description: 'Best barber of the city',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'barber01@example.com',
      passwordHash: await hash('123456', 6),
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await expect(() =>
      sut.execute({
        email: 'barber01@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
