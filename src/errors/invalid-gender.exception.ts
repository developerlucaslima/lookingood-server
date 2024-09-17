const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class InvalidGenderException extends Error {
	public readonly code: number

	constructor() {
		super('Oops! Invalid gender.')
		this.name = 'InvalidGenderException'
		this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
	}
}
