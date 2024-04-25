// Status code 404 (Not Found) - Not Found: The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
const NOT_FOUND_ERROR_CODE = 404

export class ServiceNotFoundException extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage =
      "You can't access a service that doesn't exist or has already been used."
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'ServiceNotFoundException'
    this.code = NOT_FOUND_ERROR_CODE
  }
}
