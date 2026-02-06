// src/main/routes.ts
import { Router } from 'express';
import { SqliteUserRepository } from '../infrastructure/repositories/SqliteUserRepository.js';
import { BcryptAdapter } from '../infrastructure/adapters/BcryptAdapter.js';
import { RegisterUserUseCase } from '../use-cases/RegisterUser.js';
import { RegisterUserController } from '../presentation/controllers/RegisterUserController.js';

const router = Router();

// Injeção de Dependências (Montando as peças do LEGO)
const userRepository = new SqliteUserRepository();
const encrypter = new BcryptAdapter(12); // Adicionado o salt (custo do processamento)
const registerUserUseCase = new RegisterUserUseCase(userRepository, encrypter);
const registerUserController = new RegisterUserController(registerUserUseCase);

// Rota de Registro
router.post('/users', (req, res) => registerUserController.handle(req, res));

export { router };