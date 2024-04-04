export class IsNotAvailableToChange extends Error {
  constructor() {
    super(
      'This booking cannot be changed as the allowed time has already passed.',
    )
  }
}
