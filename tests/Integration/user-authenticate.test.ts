import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAuthenticateUseCase } from '@/use-cases/user-authenticate'
import { InvalidCredentialsException } from '@/use-cases/errors/401-invalid-credentials-exception'
import { usersSetup } from 'tests/setup/users-setup'

let usersRepository: InMemoryUsersRepository
let sut: UserAuthenticateUseCase

describe('User Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserAuthenticateUseCase(usersRepository)

    usersSetup(usersRepository)
  })

  it('should allow to authenticate', async () => {
    const { user } = await sut.execute({
      email: 'john@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should prevent user authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong_email@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })

  it('should prevent user authenticate with wrong password', async () => {
    await expect(() =>
      sut.execute({
        email: 'john@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })
})
