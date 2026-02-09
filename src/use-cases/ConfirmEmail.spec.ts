import { describe, it, expect, vi } from 'vitest';
import { ConfirmEmailUseCase } from './ConfirmEmail.js';

const mockUserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockTokenProvider = {
  sign: vi.fn(),
  verify: vi.fn(),
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
};

describe('ConfirmEmailUseCase', () => {
  it('should confirm email successfully', async () => {
    const useCase = new ConfirmEmailUseCase(mockUserRepository, mockTokenProvider);
    const token = 'valid_token';
    const payload = { id: 'user_id', email: 'test@example.com' };

    mockTokenProvider.verify.mockResolvedValue(payload);

    await useCase.execute(token);

    expect(mockTokenProvider.verify).toHaveBeenCalledWith(token);
    expect(mockUserRepository.update).toHaveBeenCalledWith(payload.id, { isVerified: true });
  });

  it('should throw error if token is invalid', async () => {
    const useCase = new ConfirmEmailUseCase(mockUserRepository, mockTokenProvider);
    mockTokenProvider.verify.mockRejectedValue(new Error('Invalid token'));
    await expect(useCase.execute('invalid')).rejects.toThrow('Invalid token');
  });
});