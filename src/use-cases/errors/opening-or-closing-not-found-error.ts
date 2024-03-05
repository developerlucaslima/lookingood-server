export class OpeningOrClosingNotFoundError extends Error {
  constructor() {
    super(
      'It is necessary to create both an opening and a closing time for the same day.',
    )
  }
}
