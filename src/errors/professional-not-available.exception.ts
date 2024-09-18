const CONFLICT_ERROR_CODE = 409

export class ProfessionalNotAvailableException extends Error {
	public readonly code: number

	constructor() {
		super('Oops! Professional not available.')
		this.name = 'ProfessionalNotAvailableException'
		this.code = CONFLICT_ERROR_CODE
	}
}
