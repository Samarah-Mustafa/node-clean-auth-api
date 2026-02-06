import type { IUserRepository } from '../domain/repositories/IUserRepository.js';
import type { IEncrypter } from '../domain/adapters/IEncrypter.js';
import type { ITokenProvider } from '../domain/adapters/ITokenProvider.js';

export interface LoginResponse {
  token: string;
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

    // 3. Gera o token JWT
    const token = await this.tokenProvider.sign(
      { id: user.props.id, email: user.email },
      '24h'
    );

    // 4. Retorna o token e dados do usuário
    return {
      token,
      email: user.email,
      name: user.name,
    };
  }
}
