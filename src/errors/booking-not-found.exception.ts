const NOT_FOUND_ERROR_CODE = 404

export class BookingNotFoundException extends Error {
  public readonly code: number

  constructor() {
    super('Oops! Reservation not found.')
    this.name = 'ReservationNotFoundException'
    this.code = NOT_FOUND_ERROR_CODE
  }
}
