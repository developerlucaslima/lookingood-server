import { randomUUID } from 'node:crypto'
import type { Gender, Prisma, Role, User } from '@prisma/client'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
	public items: Map<User['id'], User> = new Map()

	async create(data: Prisma.UserUncheckedCreateInput) {
		const user: User = {
			id: randomUUID(),
			name: data.name,
			serviceGender: data.serviceGender as Gender,
			email: data.email,
			passwordHash: data.passwordHash,
			createdAt: new Date(),
			role: data.role as Role,
		}

		this.items.set(user.id, user)

		return user
	}

	async findById(id: string) {
		return this.items.get(id) || null
	}

	async findByEmail(email: string) {
		for (const user of this.items.values()) {
			if (user.email === email) {
				return user
			}
		}
		return null
	}
}
