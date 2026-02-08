import type { IPasswordResetTokenRepository } from '../../domain/repositories/IPasswordResetTokenRepository.js';

export class InMemoryPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  private tokens: Map<string, string> = new Map();

  async save(token: string, userId: string): Promise<void> {
    this.tokens.set(token, userId);
  }
}