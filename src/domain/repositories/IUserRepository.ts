import type { User } from "../entities/User.js";

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  isVerified?: boolean;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(userId: string, data: UpdateUserData): Promise<void>;
  delete(userId: string): Promise<void>;
}
