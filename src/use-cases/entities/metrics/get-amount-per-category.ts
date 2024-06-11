import { TransactionsRepository } from '@/repositories/transactions-repository'
import { CategoriesRepository } from '@/repositories/categories-repository'

interface GetAmountPerCategoryUseCaseRequest {
  month: string
}

type GetAmountPerCategoryUseCaseResponse = {
  categoryName: string
  amount: number
  percentage: number
}[]

type DataProps = {
  categoryName: string
  categoryColor: string
  amount: number
  percentage: number
}

export class GetAmountPerCategoryUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    month,
  }: GetAmountPerCategoryUseCaseRequest): Promise<GetAmountPerCategoryUseCaseResponse> {
    const transactions = await this.transactionsRepository.findByMonth(month)

    if (!transactions) {
      throw new Error('Transactions not found.')
    }

    const categories = await this.categoriesRepository.findMany()

    if (!categories || categories.length === 0) {
      return []
    }

    const data: DataProps[] = []

    const initialValue = 0

    const totalTransactions = transactions.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      initialValue,
    )

    categories?.forEach((category) => {
      const transactionsOfCategory = transactions.filter(
        (item) => item.categoryId === category.id,
      )

      const amount = transactionsOfCategory.reduce(
        (accumulator, currentValue) => accumulator + currentValue.amount,
        initialValue,
      )

      const percentage = (amount * 100) / totalTransactions

      const object: DataProps = {
        categoryName: category.category,
        categoryColor: category.color,
        amount,
        percentage: Number(percentage.toFixed(1)),
      }

      data.push(object)
    })

    return data.sort((a: DataProps, b: DataProps) => {
      return b.amount - a.amount
    })
  }
}
