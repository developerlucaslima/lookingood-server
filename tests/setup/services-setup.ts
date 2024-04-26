import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { Decimal } from '@prisma/client/runtime/library'

export const servicesSetup = async (
  servicesRepository: InMemoryServicesRepository,
) => {
  const hairId = 'Services-01'
  servicesRepository.items.set(hairId, {
    id: hairId,
    name: 'Haircut',
    price: new Decimal(50),
    genderFor: 'BOTH',
    description: 'Best haircut',
    imageUrl: 'image.url',
    modificationDeadlineMinutes: 60,
    establishmentId: 'Establishment-01',
    durationMinutes: 45,
  })

  const nailsId = 'Services-02'
  servicesRepository.items.set(nailsId, {
    id: nailsId,
    name: 'Nails',
    price: new Decimal(50),
    genderFor: 'BOTH',
    description: 'Do the nails',
    imageUrl: 'image.url',
    modificationDeadlineMinutes: 60,
    establishmentId: 'Establishment-01',
    durationMinutes: 45,
  })
}
