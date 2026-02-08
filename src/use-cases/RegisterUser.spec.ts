import { describe, it, expect, vi } from 'vitest';
import { RegisterUserUseCase } from './RegisterUser.js';

// Mock das dependências
const mockUserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockEncrypter = {
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn(),
};

const mockEmailService = {
  sendMail: vi.fn(),
};

const mockTokenProvider = {
  sign: vi.fn().mockResolvedValue('token'),
  verify: vi.fn(),
  signAccessToken: vi.fn(),
};

describe('RegisterUserUseCase', () => {
  it('should register a new user', async () => {
    const useCase = new RegisterUserUseCase(mockUserRepository, mockEncrypter, mockEmailService, mockTokenProvider);
    
    // Simula que não encontrou usuário com este email
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await useCase.execute({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password@123'
    });

    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockEncrypter.hash).toHaveBeenCalledWith('Password@123');
    expect(mockEmailService.sendMail).toHaveBeenCalled();
  });

  it('should throw error if user already exists', async () => {
    const useCase = new RegisterUserUseCase(mockUserRepository, mockEncrypter, mockEmailService, mockTokenProvider);
    
    // Simula que já existe um usuário
    mockUserRepository.findByEmail.mockResolvedValue({ id: '1', props: { email: 'test@example.com' } });

    await expect(useCase.execute({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password@123'
    })).rejects.toThrow('Este e-mail já está em uso.');
  });
});