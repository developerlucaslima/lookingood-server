const NOT_FOUND_ERROR_CODE = 404

export class EstablishmentNotFoundException extends Error {
	public readonly code: number

	constructor() {
		super('Oops! Establishment not found.')
		this.name = 'EstablishmentNotFoundException'
		this.code = NOT_FOUND_ERROR_CODE
	}
}
