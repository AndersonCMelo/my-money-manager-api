import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { FetchUsersUseCase } from './fetch-users'

let usersRepository: InMemoryUsersRepository
let sut: FetchUsersUseCase

describe('Fetch User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUsersUseCase(usersRepository)
  })

  it('should be able to get users', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    await usersRepository.create({
      name: 'John Doe 2',
      email: 'johndoe_2@example.com',
    })

    const users = await sut.execute()

    expect(users).toEqual([
      expect.objectContaining({ email: 'johndoe@example.com' }),
      expect.objectContaining({ email: 'johndoe_2@example.com' }),
    ])
  })
})
