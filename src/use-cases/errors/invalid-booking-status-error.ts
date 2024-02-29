export class InvalidBookingStatusError extends Error {
  constructor() {
    super('This booking status is not valid.')
  }
}
