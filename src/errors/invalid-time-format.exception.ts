const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class InvalidTimeFormatException extends Error {
	public readonly code: number

	constructor() {
		super('Oops! Invalid time format.')
		this.name = 'InvalidTimeFormatException'
		this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
	}
}
