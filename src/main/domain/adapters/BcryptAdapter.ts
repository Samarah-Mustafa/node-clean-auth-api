// src/infrastructure/adapters/BcryptAdapter.ts
import bcrypt from 'bcrypt';
import { IEncrypter } from '../../domain/adapters/IEncrypter';

export class BcryptAdapter implements IEncrypter {
  private readonly salt = 12;

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }
}