export interface ITokenProvider {
  sign(payload: Record<string, any>, expiresIn?: string): Promise<string>;
  verify(token: string): Promise<Record<string, any>>;
}
