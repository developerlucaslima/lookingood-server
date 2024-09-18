import type { $Enums, User } from '@prisma/client'
import { hash } from 'bcryptjs'

import type { UsersRepository } from '@/repositories/users-repository'

import { EmailNotAvailableException } from '../errors/email-not-available.exception.ts.js'
import { InvalidGenderException } from '../errors/invalid-gender.exception.js'

interface UserRegisterUseCaseRequest {
	name: string
	serviceGender: $Enums.Gender
	email: string
	password: string
}

interface UserRegisterUseCaseResponse {
	user: User
}

export class UserRegisterUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({
		name,
		serviceGender,
		email,
		password,
	}: UserRegisterUseCaseRequest): Promise<UserRegisterUseCaseResponse> {
		// It should hash user password upon registration.
		const passwordHash = await hash(password, 6)

		// It should prevent a user register with a duplicate email.
		const userWithSameEmail = await this.usersRepository.findByEmail(email)
		if (userWithSameEmail) {
			throw new EmailNotAvailableException()
		}

		// It should prevent a user register with an invalid service gender.
		if (!['MALE', 'FEMALE', 'BOTH'].includes(serviceGender)) {
			throw new InvalidGenderException()
		}

		// It should allow to register a user.
		const user = await this.usersRepository.create({
			name,
			serviceGender,
			email,
			passwordHash,
		})

		return {
			user,
		}
	}
}
