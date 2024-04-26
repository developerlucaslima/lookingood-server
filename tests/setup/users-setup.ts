import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'

export const usersSetup = async (usersRepository: InMemoryUsersRepository) => {
  const johnId = 'User-01'
  usersRepository.items.set(johnId, {
    id: johnId,
    name: 'John Doe',
    serviceGender: 'BOTH',
    email: 'john@example.com',
    passwordHash: await hash('123456', 6),
    createdAt: new Date(),
    role: 'USER',
  })

  const janeId = 'User-02'
  usersRepository.items.set(janeId, {
    id: janeId,
    name: 'Jane Smith',
    serviceGender: 'BOTH',
    email: 'jane@example.com',
    passwordHash: await hash('123456', 6),
    createdAt: new Date(),
    role: 'USER',
  })
}
