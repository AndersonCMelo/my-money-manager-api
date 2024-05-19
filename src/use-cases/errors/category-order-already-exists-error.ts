export class CategoryOrderAlreadyExistsError extends Error {
  constructor() {
    super('Category order already exists.')
  }
}
