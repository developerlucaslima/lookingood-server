import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professional-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { AddProfessionalUseCase } from '../factories/add-professional'

let professionalsRepository: InMemoryProfessionalsRepository
let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: AddProfessionalUseCase

describe('Add Professional Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    professionalsRepository = new InMemoryProfessionalsRepository()
    sut = new AddProfessionalUseCase(
      establishmentsRepository,
      professionalsRepository,
    )

    establishmentsRepository.items.push({
      id: 'Barber-01',
      name: 'John Barber',
      description: 'Best barber of the city',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'barber01@example.com',
      passwordHash: '123456',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
      createdAt: new Date(),
    })
  })

  it('should to create professional', async () => {
    const { professional } = await sut.execute({
      name: 'John Doe',
      imageUrl: 'image.url',
      establishmentId: 'Barber-01',
    })
    expect(professional.id).toEqual(expect.any(String))
  })

  it('should not be able to add professional with nonexistent establishmentId', async () => {
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        imageUrl: 'image.url',
        establishmentId: 'Barber-02',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
