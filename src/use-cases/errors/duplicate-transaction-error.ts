export class DuplicateTransactionError extends Error {
  constructor() {
    super(
      'A transaction with the same amount, date and account already exists.',
    )
  }
}
