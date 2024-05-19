export class PassowrdNotRegisteredError extends Error {
  constructor() {
    super('Password not registered.')
  }
}
