import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { CreateEstablishmentUseCase } from '../factories/create-establishment'

let establishmentRepository: InMemoryEstablishmentsRepository
let sut: CreateEstablishmentUseCase

describe('Create Establishment Use Case', () => {
  beforeEach(() => {
    establishmentRepository = new InMemoryEstablishmentsRepository()
    sut = new CreateEstablishmentUseCase(establishmentRepository)
  })

  it('should to create establishment', async () => {
    const { establishment } = await sut.execute({
      name: 'JavaScript Gym',
      description: null,
      phone: null,
      imageUrl: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(establishment.id).toEqual(expect.any(String))
  })
})
