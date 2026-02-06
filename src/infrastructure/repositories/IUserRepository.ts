import type { User } from "../../domain/entities/User.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}