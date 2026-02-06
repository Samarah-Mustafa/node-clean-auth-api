export interface ITokenBlacklistRepository {
  add(token: string): Promise<void>;
  contains(token: string): Promise<boolean>;
}