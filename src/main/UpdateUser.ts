import type { IUserRepository, UpdateUserData } from '../domain/repositories/IUserRepository.js';
import type { IEncrypter } from '../domain/adapters/IEncrypter.js';

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypter
  ) {}

  async execute(userId: string, data: UpdateUserData): Promise<void> {
    if (Object.keys(data).length === 0) {
      throw new Error('No data provided to update');
    }

    if (data.email) {
      const userWithEmail = await this.userRepository.findByEmail(data.email);
      if (userWithEmail && (userWithEmail as any).props.id !== userId) {
        throw new Error('Email already in use');
      }
    }

    const updates: UpdateUserData = { ...data };

    if (data.password) {
      updates.password = await this.encrypter.hash(data.password);
    }

    await this.userRepository.update(userId, updates);
  }
}