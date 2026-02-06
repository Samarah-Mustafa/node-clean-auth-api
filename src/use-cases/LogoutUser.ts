import type { ITokenBlacklistRepository } from '../domain/repositories/ITokenBlacklistRepository.js';

export class LogoutUserUseCase {
  constructor(private readonly blacklistRepository: ITokenBlacklistRepository) {}

  async execute(token: string): Promise<void> {
    await this.blacklistRepository.add(token);
  }
}