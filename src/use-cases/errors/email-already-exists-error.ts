export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('E-mail already exists')
  }
}

// export class EmailAlreadyExistsError extends Error {
//   private readonly code: number
//   constructor(email: string) {
//     super('E-mail already exists...')
//     this.code = 429
//   }
// }
