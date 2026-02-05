// src/domain/adapters/IEncrypter.ts

export interface IEncrypter {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}