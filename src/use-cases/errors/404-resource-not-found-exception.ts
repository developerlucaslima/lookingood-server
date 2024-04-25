// Status code 404 (Not Found) - Not Found: The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
const NOT_FOUND_ERROR_CODE = 404

export class ResourceNotFoundException extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage =
      "Oops! The resource you're looking for could not be found."
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'ResourceNotFoundException'
    this.code = NOT_FOUND_ERROR_CODE
  }
}
