import { Prisma, Classification } from '@prisma/client'

export interface UpdateClassificationProps {
  id: string
  name: string
  color: string
}

export interface UpdateClassificationOrderProps {
  id: string
  order: number
}

export interface ClassificationsRepository {
  findById(id: string): Promise<Classification | null>
  findByClassificationName(
    classificationName: string,
  ): Promise<Classification | null>
  findByOrder(order: number): Promise<Classification | null>
  findMany(): Promise<Classification[] | null>
  create(data: Prisma.ClassificationCreateInput): Promise<Classification>
  update({
    id,
    name,
    color,
  }: UpdateClassificationProps): Promise<Classification>
  updateOrder({ id, order }: UpdateClassificationOrderProps): Promise<void>
  delete(id: string): Promise<void>
}
