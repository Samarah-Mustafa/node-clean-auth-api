import type { IUserRepository } from '../domain/repositories/IUserRepository.js';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    // Assuming userRepository has a delete method
    await (this.userRepository as any).delete(userId);
  }
}