import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from '@/use-cases/get-user-profile'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserNotFoundException } from '@/use-cases/errors/404-user-not-found-exception'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)

    const userId = 'User-01'
    usersRepository.items.set(userId, {
      id: userId,
      name: 'Registered User',
      serviceGender: 'BOTH',
      email: 'registered_user@example.com',
      passwordHash: await hash('123456', 6),
      createdAt: new Date(),
      role: 'USER',
    })
  })

  it('should allow get user profile', async () => {
    const { user } = await sut.execute({
      userId: 'User-01',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('it prevent get user profile if user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'Nonexistent-User-01', // invalid user
      }),
    ).rejects.toBeInstanceOf(UserNotFoundException)
  })
})
