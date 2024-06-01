import { Prisma, Categories, Classification } from '@prisma/client'

export interface UpdateCategoryProps {
  id: string
  category: string
  color: string
}

export interface UpdateCategoryOrderProps {
  id: string
  order: string
}

export interface CategoriesRepository {
  findById(id: string): Promise<Categories | null>
  findByCategoryName(categoryName: string): Promise<Categories | null>
  findByOrder(order: string): Promise<Categories | null>
  // findMany(): Promise<Categories[] | null>
  findMany(): Promise<Classification[] | null>
  create(data: Prisma.CategoriesCreateInput): Promise<Categories>
  update({ id, category, color }: UpdateCategoryProps): Promise<Categories>
  updateOrder({ id, order }: UpdateCategoryOrderProps): Promise<void>
  delete(id: string): Promise<void>
}
