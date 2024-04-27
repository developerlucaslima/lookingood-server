import { expect, describe, it, beforeEach } from 'vitest'
import { GetEstablishmentProfileUseCase } from '@/use-cases/get-establishment-profile'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'

let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: GetEstablishmentProfileUseCase

describe('Get Establishment Profile Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    sut = new GetEstablishmentProfileUseCase(establishmentsRepository)
  })

  it('should allow get establishment profile', async () => {
    const { establishment } = await sut.execute({
      establishmentId: 'Establishment-01',
    })

    expect(establishment.id).toEqual(expect.any(String))
  })

  it('prevent get establishment profile if establishment does not exist', async () => {
    await expect(
      sut.execute({
        establishmentId: 'Nonexistent-Establishment-01',
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })
})
