import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { User } from '@prisma/client'

interface RegisterUseCaseParams {
  name: string
  email: string
  password?: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseParams): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    if (password) {
      const passwordHash = await hash(password, 6)

      const user = await this.usersRepository.create({
        name,
        email,
        password: passwordHash,
      })

      return { user }
    } else {
      const user = await this.usersRepository.create({
        name,
        email,
      })

      return { user }
    }
  }
}
