import { BankAccounts } from '@prisma/client'

type NotTransferTransactionProps = {
  type: 'income' | 'expense'
}

type TransferTransactionProps = {
  type: 'transfer'
  destinationBankAccount: BankAccounts | null
}

type CalculateWhenDeleteTransactionRequest = {
  transactionValue: number
  bankAccount: BankAccounts
} & (NotTransferTransactionProps | TransferTransactionProps)

interface CalculateWhenDeleteTransactionResponse {
  source: number
  destination: number | null
}

export function calculateBalanceWhenDeleteTransaction(
  props: CalculateWhenDeleteTransactionRequest,
): CalculateWhenDeleteTransactionResponse {
  if (props.type === 'transfer') {
    const sourceNewValue =
      props.bankAccount.accountBalance + props.transactionValue

    if (!props.destinationBankAccount) {
      return {
        source: sourceNewValue,
        destination: null,
      }
    } else {
      const destinationNewValue =
        props.destinationBankAccount.accountBalance - props.transactionValue

      return {
        source: sourceNewValue,
        destination: destinationNewValue,
      }
    }
  } else if (props.type === 'expense') {
    const newValue = props.bankAccount.accountBalance + props.transactionValue

    return { source: newValue, destination: null }
  } else {
    const newValue = props.bankAccount.accountBalance - props.transactionValue

    return { source: newValue, destination: null }
  }
}
