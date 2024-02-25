import { expect, describe, it, beforeEach } from 'vitest'
import { CreateServiceUseCase } from '../factories/create-service'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

let servicesRepository: InMemoryServicesRepository
let establishmentRepository: InMemoryEstablishmentsRepository
let sut: CreateServiceUseCase

describe('Create Service Use Case', () => {
  beforeEach(() => {
    establishmentRepository = new InMemoryEstablishmentsRepository()
    servicesRepository = new InMemoryServicesRepository()
    sut = new CreateServiceUseCase(establishmentRepository, servicesRepository)

    establishmentRepository.items.push({
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

  it('should to create service', async () => {
    const { service } = await sut.execute({
      name: 'Hair cut',
      price: 40,
      gender: 'Male',
      description: 'Male hair cut',
      imageUrl: 'image.url',
      establishmentId: 'Barber-01',
    })
    expect(service.id).toEqual(expect.any(String))
  })
})
