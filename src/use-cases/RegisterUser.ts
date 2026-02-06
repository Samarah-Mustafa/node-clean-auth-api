// src/use-cases/RegisterUser.ts
import { User, type UserProps } from "../domain/entities/User.js";
import type { IUserRepository } from "../domain/repositories/IUserRepository.js";
import type { IEncrypter } from "../domain/adapters/IEncrypter.js";

export class RegisterUserUseCase {
  // Recebemos as interfaces, não as classes reais (SOLID - DIP)
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypter
  ) {}

  async execute(data: UserProps): Promise<void> {
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
  }
}