const NOT_FOUND_ERROR_CODE = 404

export class ProfessionalNotFoundException extends Error {
	public readonly code: number

	constructor() {
		super('Oops! Professional not found.')
		this.name = 'ProfessionalNotFoundException'
		this.code = NOT_FOUND_ERROR_CODE
	}
}
