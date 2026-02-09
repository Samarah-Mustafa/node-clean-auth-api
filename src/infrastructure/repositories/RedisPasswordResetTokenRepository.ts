import crypto from 'node:crypto';
import { redis } from '../database/redis.js';
import type { IPasswordResetTokenRepository } from '../../domain/repositories/IPasswordResetTokenRepository.js';

export class RedisPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  private readonly PREFIX = 'reset_token:';
  // 1 hora de expiração (deve corresponder ou ser ligeiramente maior que a validade do JWT de recuperação)
  private readonly TTL_SECONDS = 60 * 60; 

  /**
   * Gera um hash SHA-256 do token para segurança,
   * garantindo que não armazenamos o token "cru" no banco.
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async save(token: string): Promise<void> {
    const hash = this.hashToken(token);
    // Salva o token com expiração automática (EX)
    // O valor 'valid' é arbitrário, pois verificamos apenas a existência da chave
    await redis.set(`${this.PREFIX}${hash}`, 'valid', 'EX', this.TTL_SECONDS);
  }

  async exists(token: string): Promise<boolean> {
    const hash = this.hashToken(token);
    const result = await redis.exists(`${this.PREFIX}${hash}`);
    return result === 1;
  }

  async delete(token: string): Promise<void> {
    const hash = this.hashToken(token);
    await redis.del(`${this.PREFIX}${hash}`);
  }
}