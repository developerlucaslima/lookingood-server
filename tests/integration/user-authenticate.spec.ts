import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InvalidCredentialsException } from '@/errors/invalid-credentials.exception'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAuthenticateUseCase } from '@/use-cases/user-authenticate'

let usersRepository: InMemoryUsersRepository
let sut: UserAuthenticateUseCase

describe('User Authenticate Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserAuthenticateUseCase(usersRepository)

    // User 01 -------------------
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

  it('should allow user authenticate', async () => {
    const { user } = await sut.execute({
      email: 'registered_user@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should prevent user authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong_email@example.com', // invalid email
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })

  it('should prevent user authenticate with wrong password', async () => {
    await expect(() =>
      sut.execute({
        email: 'registered_user@example.com',
        password: '123123', // invalid password
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })
})
