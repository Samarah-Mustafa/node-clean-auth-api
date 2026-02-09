import type { IUserRepository } from '../domain/repositories/IUserRepository.js';
import type { ITokenProvider } from '../domain/adapters/ITokenProvider.js';
import type { IEmailService } from '../domain/adapters/IEmailService.js';

export class ResendConfirmationEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenProvider: ITokenProvider,
    private readonly emailService: IEmailService
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (user.isVerified) {
      throw new Error('Este e-mail já foi verificado.');
    }

    const token = await this.tokenProvider.sign({ id: user.props.id, email: user.email }, '24h');
    const confirmLink = `http://localhost:3333/confirm-email?token=${token}`;

    await this.emailService.sendMail(
      user.email,
      'Reenvio: Confirme seu e-mail',
      `<p>Olá ${user.name},</p><p>Você solicitou o reenvio do e-mail de confirmação. Clique no link abaixo para confirmar:</p><a href="${confirmLink}">${confirmLink}</a>`
    );
  }
}