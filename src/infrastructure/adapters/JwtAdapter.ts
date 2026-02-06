import jwt from 'jsonwebtoken';
import type { ITokenProvider } from '../../domain/adapters/ITokenProvider.js';

export class JwtAdapter implements ITokenProvider {
  constructor(private readonly secret: string) {}

  async sign(
    payload: Record<string, any>,
    expiresIn: string = '24h'
  ): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  async verify(token: string): Promise<Record<string, any>> {
    return jwt.verify(token, this.secret) as Record<string, any>;
  }
}
