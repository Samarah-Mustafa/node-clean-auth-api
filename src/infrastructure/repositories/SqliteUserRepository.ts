import crypto from 'node:crypto';
import type { IUserRepository, UpdateUserData } from "../../domain/repositories/IUserRepository.js";
import { User } from "../../domain/entities/User.js";
import { db } from "../database/connection.js";

export class SqliteUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userData = await db('users').where({ email }).first();

    if (!userData) {
      return null;
    }

    return new User({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isVerified: Boolean(userData.is_verified) // Converte 1/0 do SQLite para boolean
    });
  }

  async save(user: User): Promise<void> {
    await db('users').insert({
      id: user.props.id ?? crypto.randomUUID(),
      name: user.props.name,
      email: user.props.email,
      password: user.props.password
    });
  }

  async update(userId: string, data: UpdateUserData): Promise<void> {
    await db('users').where({ id: userId }).update(data);
  }

  async delete(userId: string): Promise<void> {
    await db('users').where({ id: userId }).delete();
  }
}