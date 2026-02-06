import type { IUserRepository } from '../domain/repositories/IUserRepository.js';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}