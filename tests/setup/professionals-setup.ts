import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository'

export const professionalsSetup = async (
  professionalsRepository: InMemoryProfessionalsRepository,
) => {
  const johnId = 'Professional-01'
  professionalsRepository.items.set(johnId, {
    id: johnId,
    name: 'John Doe',
    imageUrl: 'image.url',
    establishmentId: 'Establishment-01',
  })

  const janeId = 'Professional-02'
  professionalsRepository.items.set(janeId, {
    id: janeId,
    name: 'Jane Smith',
    imageUrl: 'image.url',
    establishmentId: 'Establishment-01',
  })

  const jackId = 'Professional-03'
  professionalsRepository.items.set(jackId, {
    id: jackId,
    name: 'Jane Smith',
    imageUrl: 'image.url',
    establishmentId: 'Establishment-03',
  })
}
