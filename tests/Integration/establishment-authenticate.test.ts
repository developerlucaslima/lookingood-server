import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { EstablishmentAuthenticateUseCase } from '@/use-cases/establishment-authenticate'
import { InvalidCredentialsException } from '@/use-cases/errors/401-invalid-credentials-exception'
import { establishmentsSetup } from 'tests/setup/establishments-setup'

let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: EstablishmentAuthenticateUseCase

describe('Establishment Authenticate Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    sut = new EstablishmentAuthenticateUseCase(establishmentsRepository)

    establishmentsSetup(establishmentsRepository)
  })

  it('should allow to authenticate', async () => {
    const { establishment } = await sut.execute({
      email: 'barber@example.com',
      password: '123456',
    })
    expect(establishment.id).toEqual(expect.any(String))
  })

  it('should prevent establishment authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong_email@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })

  it('should prevent establishment authenticate with wrong password', async () => {
    await expect(() =>
      sut.execute({
        email: 'barber@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })
})
