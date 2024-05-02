import { UsersRepository } from '@/repositories/users-repository'
// import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export class GetUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute() {
    const users = await this.usersRepository.list()

    return users
  }
}
