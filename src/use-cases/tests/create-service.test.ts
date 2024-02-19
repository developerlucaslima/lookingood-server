import { expect, describe, it, beforeEach } from 'vitest'
import { CreateServiceUseCase } from '../factories/create-service'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'

let servicesRepository: InMemoryServicesRepository
let establishmentRepository: InMemoryEstablishmentsRepository
let sut: CreateServiceUseCase

describe('Create Service Use Case', () => {
  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository()
    establishmentRepository = new InMemoryEstablishmentsRepository()
    sut = new CreateServiceUseCase(servicesRepository, establishmentRepository)
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
