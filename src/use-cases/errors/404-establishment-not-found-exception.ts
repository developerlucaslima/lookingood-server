// Status code 404 (Not Found) - Not Found: The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
const NOT_FOUND_ERROR_CODE = 404

export class EstablishmentNotFoundException extends Error {
  public readonly code: number

  constructor() {
    super("We couldn't find the establishment you're looking for.")

    this.name = 'EstablishmentNotFoundException'
    this.code = NOT_FOUND_ERROR_CODE
  }
}
