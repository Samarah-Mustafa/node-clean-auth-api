import crypto from 'node:crypto';
import { redis } from '../database/redis.js';
import type { ITokenBlacklistRepository } from '../../domain/repositories/ITokenBlacklistRepository.js';

export class RedisTokenBlacklistRepository implements ITokenBlacklistRepository {
  private readonly PREFIX = 'blacklist:';
  private readonly DEFAULT_TTL = 60 * 60 * 24; // 24 horas (ajuste conforme a validade do seu JWT)

  /**
   * Gera um hash SHA-256 do token.
   * Isso garante que, se o Redis vazar, os tokens originais não sejam expostos.
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async add(token: string): Promise<void> {
    const hash = this.hashToken(token);
    // Salva o hash com um tempo de expiração (TTL)
    // O valor 'revoked' é arbitrário, o importante é a chave existir
    await redis.set(`${this.PREFIX}${hash}`, 'revoked', 'EX', this.DEFAULT_TTL);
  }

  async contains(token: string): Promise<boolean> {
    const hash = this.hashToken(token);
    const result = await redis.exists(`${this.PREFIX}${hash}`);
    return result === 1;
  }
}