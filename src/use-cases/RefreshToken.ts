import type { ITokenProvider } from '../domain/adapters/ITokenProvider.js';

export class RefreshTokenUseCase {
  constructor(private readonly tokenProvider: ITokenProvider) {}

  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = await this.tokenProvider.verify(refreshToken);
    
    const accessToken = await this.tokenProvider.signAccessToken({
      id: payload.id,
      email: payload.email,
    });

    return { accessToken };
  }
}