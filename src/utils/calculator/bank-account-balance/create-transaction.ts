import { BankAccounts } from '@prisma/client'

type NotTransferTransactionProps = {
  type: 'income' | 'expense'
}

type TransferTransactionProps = {
  type: 'transfer'
  destinationBankAccount: BankAccounts | null
}

type CalculateWhenCreateTransactionRequest = {
  transactionValue: number
  bankAccount: BankAccounts
} & (NotTransferTransactionProps | TransferTransactionProps)

interface CalculateWhenCreateTransactionResponse {
  source: number
  destination: number | null
}

export function calculateBalanceWhenCreateTransaction(
  props: CalculateWhenCreateTransactionRequest,
): CalculateWhenCreateTransactionResponse {
  if (props.type === 'transfer') {
    const sourceNewValue =
      props.bankAccount.accountBalance - props.transactionValue
    const destinationNewValue =
      props.destinationBankAccount!.accountBalance + props.transactionValue

    return {
      source: sourceNewValue,
      destination: destinationNewValue,
    }
  } else if (props.type === 'expense') {
    const newValue = props.bankAccount.accountBalance - props.transactionValue

    return { source: newValue, destination: null }
  } else {
    const newValue = props.bankAccount.accountBalance + props.transactionValue

    return { source: newValue, destination: null }
  }
}
