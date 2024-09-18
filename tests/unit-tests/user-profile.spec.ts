import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserNotFoundException } from '@/errors/user-not-found.exception'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserProfileUseCase } from '@/use-cases/user-profile'

let usersRepository: InMemoryUsersRepository
let sut: UserProfileUseCase

describe('User Profile Use Case', () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository()
		sut = new UserProfileUseCase(usersRepository)

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

	it('should allow get user profile', async () => {
		const { user } = await sut.execute({
			userId: 'User-01',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should prevent get user profile if user does not exist', async () => {
		await expect(
			sut.execute({
				userId: 'Nonexistent-User-01', // invalid user
			}),
		).rejects.toBeInstanceOf(UserNotFoundException)
	})
})
