import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  // async findByGender(serviceGender: string) {
  //   const user = this.items.find((item) => item.serviceGender === serviceGender)

  //   if (!user) {
  //     return null
  //   }

  //   return user
  // }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      serviceGender: data.serviceGender,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    }

    this.items.push(user)

    return user
  }
}
