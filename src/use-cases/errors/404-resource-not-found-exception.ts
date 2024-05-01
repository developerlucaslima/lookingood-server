// Status code 404 (Not Found) - Not Found: The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
const NOT_FOUND_ERROR_CODE = 404

type ResourceNotFoundExceptionReason = 'mismatched'

export class ResourceNotFoundException extends Error {
  public readonly code: number

  constructor(reason?: ResourceNotFoundExceptionReason) {
    switch (reason) {
      case 'mismatched':
        super('Service reservation issue due to resource incompatibility.')
        break
      default:
        super("We couldn't find the resource you're looking for.")
    }

    this.name = 'ResourceNotFoundException'
    this.code = NOT_FOUND_ERROR_CODE
  }
}
