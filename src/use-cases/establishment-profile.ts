import type { Establishment } from '@prisma/client'

import type { EstablishmentsRepository } from '@/repositories/establishments-repository'

import { EstablishmentNotFoundException } from '../errors/establishment-not-found.exception'

interface EstablishmentProfileUseCaseRequest {
	establishmentId: string
}

interface EstablishmentProfileUseCaseResponse {
	establishment: Establishment
}

export class EstablishmentProfileUseCase {
	constructor(private establishmentsRepository: EstablishmentsRepository) {}

	async execute({
		establishmentId,
	}: EstablishmentProfileUseCaseRequest): Promise<EstablishmentProfileUseCaseResponse> {
		// It should prevent get establishment profile if establishment does not exist.
		const establishment = await this.establishmentsRepository.findById(establishmentId)
		if (!establishment) {
			throw new EstablishmentNotFoundException()
		}

		// It should allow get establishment profile.
		return {
			establishment,
		}
	}
}
