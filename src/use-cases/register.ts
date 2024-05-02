import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseParams {
  name: string
  email: string
  password?: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseParams) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    if (password) {
      const passwordHash = await hash(password, 6)

      await this.usersRepository.create({
        name,
        email,
        password: passwordHash,
      })
    } else {
      await this.usersRepository.create({
        name,
        email,
      })
    }
  }
}
