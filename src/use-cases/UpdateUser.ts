import type { IUserRepository } from '../domain/repositories/IUserRepository.js';
import type { IEncrypter } from '../domain/adapters/IEncrypter.js';

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypter
  ) {}

  async execute(userId: string, data: { name?: string; email?: string; password?: string }): Promise<void> {
    const updates: any = { ...data };

    if (data.password) {
      updates.password = await this.encrypter.hash(data.password);
    }

    // Assuming userRepository has an update method
    await (this.userRepository as any).update(userId, updates);
  }
}