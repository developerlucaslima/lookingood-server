const TIME_NOT_AVAILABLE_ERROR_CODE = 409

class TimeNotAvailableError extends Error {
  public readonly code: number

  constructor(startHour: string, endHour: string, reason?: string) {
    let errorMessage = `The time from ${startHour} to ${endHour} is not available at the moment.`
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'TimeNotAvailableError'
    this.code = TIME_NOT_AVAILABLE_ERROR_CODE
  }
}

module.exports = TimeNotAvailableError
