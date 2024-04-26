import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserRegisterUseCase } from '@/use-cases/user-register'
import { InvalidGenderException } from '@/use-cases/errors/422-invalid-gender-exception'
import { EmailNotAvailableException } from '@/use-cases/errors/409-email-not-available-exception.ts'
import { usersSetup } from 'tests/setup/users-setup'

let usersRepository: InMemoryUsersRepository
let sut: UserRegisterUseCase

describe('User Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserRegisterUseCase(usersRepository)

    usersSetup(usersRepository)
  })

  it('should allow to register a user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      serviceGender: 'MALE',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Dev Lucas Lima',
      serviceGender: 'MALE',
      email: 'devlucaslima@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should prevent a user register with a duplicate email', async () => {
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        serviceGender: 'BOTH',
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailNotAvailableException)
  })

  it('should validate serviceGender as "MALE"', async () => {
    const { user } = await sut.execute({
      name: 'Dev Lucas Lima',
      serviceGender: 'MALE',
      email: 'devlucaslima@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should validate serviceGender as "FEMALE"', async () => {
    const { user } = await sut.execute({
      name: 'Dev Lucas Lima',
      serviceGender: 'FEMALE',
      email: 'devlucaslima@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should validate serviceGender as "BOTH"', async () => {
    const { user } = await sut.execute({
      name: 'Dev Lucas Lima',
      serviceGender: 'MALE',
      email: 'devlucaslima@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('It should prevent a user register with an invalid service gender', async () => {
    await expect(() =>
      sut.execute({
        name: 'Dev Lucas Lima',
        serviceGender: 'INVALID_GENDER' as 'BOTH',
        email: 'devlucaslima@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidGenderException)
  })

  it('should prevent a user register with service gender as blank', async () => {
    await expect(() =>
      sut.execute({
        name: 'Dev Lucas Lima',
        serviceGender: '' as 'BOTH',
        email: 'devlucaslima@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidGenderException)
  })
})
