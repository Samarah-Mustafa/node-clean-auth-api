export interface TokenPayload {
  id: string;
  email: string;
}

export interface ITokenProvider {
  sign(payload: TokenPayload, expiresIn?: string): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
  signAccessToken(payload: TokenPayload): Promise<string>;
  signRefreshToken(payload: TokenPayload): Promise<string>;
}
