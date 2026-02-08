export interface IPasswordResetTokenRepository {
  save(token: string, userId: string): Promise<void>;
}