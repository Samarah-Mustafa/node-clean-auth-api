import { describe, it, expect, vi } from 'vitest';
import { ResendConfirmationEmailUseCase } from './ResendConfirmationEmail.js';

const mockUserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockTokenProvider = {
  sign: vi.fn().mockResolvedValue('token'),
  verify: vi.fn(),
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
};

const mockEmailService = {
  sendMail: vi.fn(),
};

describe('ResendConfirmationEmailUseCase', () => {
  it('should resend confirmation email', async () => {
    const useCase = new ResendConfirmationEmailUseCase(mockUserRepository, mockTokenProvider, mockEmailService);
    
    mockUserRepository.findByEmail.mockResolvedValue({
      props: { id: '1' },
      email: 'test@example.com',
      name: 'Test',
      isVerified: false
    });

    await useCase.execute('test@example.com');

    expect(mockTokenProvider.sign).toHaveBeenCalled();
    expect(mockEmailService.sendMail).toHaveBeenCalled();
  });

  it('should throw error if user already verified', async () => {
    const useCase = new ResendConfirmationEmailUseCase(mockUserRepository, mockTokenProvider, mockEmailService);
    mockUserRepository.findByEmail.mockResolvedValue({
      props: { id: '1' },
      email: 'test@example.com',
      isVerified: true
    });
    await expect(useCase.execute('test@example.com')).rejects.toThrow('Este e-mail já foi verificado.');
  });
});