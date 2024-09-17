const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class InvalidServiceDurationException extends Error {
	public readonly code: number

	constructor() {
		super('Oops! Invalid service duration.')
		this.name = 'InvalidServiceDurationException'
		this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
	}
}
