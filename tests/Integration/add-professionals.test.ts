import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository'
import { AddProfessionalUseCase } from '@/use-cases/add-professional'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'
import { establishmentsSetup } from 'tests/setup/establishments-setup'
import { describe, beforeEach, it, expect } from 'vitest'

let establishmentRepository: InMemoryEstablishmentsRepository
let professionalsRepository: InMemoryProfessionalsRepository
let sut: AddProfessionalUseCase

describe('Add Professional Use Case', () => {
  beforeEach(() => {
    establishmentRepository = new InMemoryEstablishmentsRepository()
    professionalsRepository = new InMemoryProfessionalsRepository()
    sut = new AddProfessionalUseCase(
      establishmentRepository,
      professionalsRepository,
    )

    establishmentsSetup(establishmentRepository)
  })

  it('should allow add a professional', async () => {
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
