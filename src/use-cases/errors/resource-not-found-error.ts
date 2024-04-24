// Status code 404 (Not Found) - Not Found: The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
const RESOURCE_NOT_FOUND_ERROR_CODE = 404

export class ResourceNotFoundError extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage = 'Resource not found.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'ResourceNotFoundError'
    this.code = RESOURCE_NOT_FOUND_ERROR_CODE
  }
}
