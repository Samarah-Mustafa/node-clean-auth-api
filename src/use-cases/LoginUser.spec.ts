import { describe, it, expect, vi } from 'vitest';
import { LoginUserUseCase } from './LoginUser.js';

const mockUserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockEncrypter = {
  hash: vi.fn(),
  compare: vi.fn(),
};

const mockTokenProvider = {
  sign: vi.fn(),
  verify: vi.fn(),
  signAccessToken: vi.fn().mockResolvedValue('access_token'),
  signRefreshToken: vi.fn().mockResolvedValue('refresh_token'),
};

describe('LoginUserUseCase', () => {
  it('should throw error if user is not verified', async () => {
    const useCase = new LoginUserUseCase(mockUserRepository, mockEncrypter, mockTokenProvider);
    
    // Simula um usuário que existe mas NÃO confirmou o e-mail
    mockUserRepository.findByEmail.mockResolvedValue({
      props: { id: '1' },
      email: 'test@example.com',
      password: 'hashed_password',
      name: 'Test',
      isVerified: false // Importante: false
    });

    await expect(useCase.execute('test@example.com', 'password'))
      .rejects
      .toThrow('Por favor, confirme seu e-mail antes de fazer login.');
  });

  it('should login successfully if user is verified', async () => {
    const useCase = new LoginUserUseCase(mockUserRepository, mockEncrypter, mockTokenProvider);
    
    // Simula um usuário verificado
    mockUserRepository.findByEmail.mockResolvedValue({
      props: { id: '1' },
      email: 'test@example.com',
      password: 'hashed_password',
      name: 'Test',
      isVerified: true // Importante: true
    });

    mockEncrypter.compare.mockResolvedValue(true);

    const result = await useCase.execute('test@example.com', 'password');

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });
});