import type { IUserRepository } from '../domain/repositories/IUserRepository.js';
import type { IEncrypter } from '../domain/adapters/IEncrypter.js';
import type { ITokenProvider } from '../domain/adapters/ITokenProvider.js';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypter,
    private readonly tokenProvider: ITokenProvider
  ) {}

  async execute(email: string, password: string): Promise<LoginResponse> {
    // 1. Busca o usuário pelo email
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // 2. Valida a senha comparando com o hash armazenado
    const passwordMatches = await this.encrypter.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      throw new Error('Senha incorreta.');
    }

    // 3. Gera os tokens JWT
    const payload = { id: user.props.id, email: user.email };
    const accessToken = await this.tokenProvider.signAccessToken(payload);
    const refreshToken = await this.tokenProvider.signRefreshToken(payload);

    // 4. Retorna os tokens e dados do usuário
    return {
      accessToken,
      refreshToken,
      email: user.email,
      name: user.name,
    };
  }
}
