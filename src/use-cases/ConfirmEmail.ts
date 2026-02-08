import type { IUserRepository } from '../domain/repositories/IUserRepository.js';
import type { ITokenProvider } from '../domain/adapters/ITokenProvider.js';

export class ConfirmEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenProvider: ITokenProvider
  ) {}

  async execute(token: string): Promise<void> {
    const payload = await this.tokenProvider.verify(token);
    await this.userRepository.update(payload.id, { isVerified: true });
  }
}