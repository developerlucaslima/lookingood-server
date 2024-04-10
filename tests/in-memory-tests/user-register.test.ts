import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserRegisterUseCase } from '@/use-cases/user-register'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'
import { InvalidServiceGenderError } from '@/use-cases/errors/invalid-service-gender-error'

let usersRepository: InMemoryUsersRepository
let sut: UserRegisterUseCase

describe('User Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserRegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      serviceGender: 'Male',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      serviceGender: 'Male',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      serviceGender: 'Male',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        serviceGender: 'Male',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should validate serviceGender as "Male"', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      serviceGender: 'Male',
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should validate serviceGender as "Female"', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      serviceGender: 'Female',
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should validate serviceGender as "Both"', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      serviceGender: 'Both',
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be allowed to register service gender unless specified as "Male", "Female" or "Both"', async () => {
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        serviceGender: 'Invalid',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidServiceGenderError)
  })

  it('should not be allowed to register service gender as blank', async () => {
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        serviceGender: '',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidServiceGenderError)
  })
})
