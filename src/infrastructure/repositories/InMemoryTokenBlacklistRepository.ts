import type { ITokenBlacklistRepository } from '../../domain/repositories/ITokenBlacklistRepository.js';

export class InMemoryTokenBlacklistRepository implements ITokenBlacklistRepository {
  private blacklist: Set<string> = new Set();

  async add(token: string): Promise<void> {
    this.blacklist.add(token);
  }

  async contains(token: string): Promise<boolean> {
    return this.blacklist.has(token);
  }
}