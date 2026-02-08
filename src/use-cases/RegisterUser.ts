// src/use-cases/RegisterUser.ts
import { User, type UserProps, passwordComplexitySchema } from "../domain/entities/User.js";
import type { IUserRepository } from "../domain/repositories/IUserRepository.js";
import type { IEncrypter } from "../domain/adapters/IEncrypter.js";
import type { IEmailService } from "../domain/adapters/IEmailService.js";
import type { ITokenProvider } from "../domain/adapters/ITokenProvider.js";

export class RegisterUserUseCase {
  // Recebemos as interfaces, não as classes reais (SOLID - DIP)
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypter,
    private readonly emailService: IEmailService,
    private readonly tokenProvider: ITokenProvider
  ) {}

  async execute(data: UserProps): Promise<void> {
    // 0. Valida a complexidade da senha antes de tudo
    passwordComplexitySchema.parse(data.password);

    // 1. Verifica se o e-mail já está cadastrado
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);
    if (userAlreadyExists) {
      throw new Error("Este e-mail já está em uso.");
    }

    // 2. Criptografa a senha antes de salvar
    const hashedPassword = await this.encrypter.hash(data.password);

    // 3. Cria a entidade (o Zod valida os dados aqui dentro)
    const user = new User({
      ...data,
      password: hashedPassword,
    });

    // 4. Salva no banco de dados através do repositório
    await this.userRepository.save(user);

    // 5. Envia e-mail de confirmação
    const token = await this.tokenProvider.sign({ id: user.props.id, email: user.email }, '24h');
    const confirmLink = `http://localhost:3333/confirm-email?token=${token}`;

    await this.emailService.sendMail(
      data.email,
      'Bem-vindo! Confirme seu e-mail',
      `<p>Olá ${data.name},</p><p>Obrigado por se cadastrar. Clique no link abaixo para confirmar seu e-mail:</p><a href="${confirmLink}">${confirmLink}</a>`
    );
  }
}