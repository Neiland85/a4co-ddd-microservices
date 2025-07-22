import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User, UserStatus } from '../../domain/aggregates/user.aggregate';

// Interface simple para el cliente Prisma
interface PrismaClientInterface {
  user: {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    count: (args?: any) => Promise<number>;
    findMany: (args?: any) => Promise<any[]>;
  };
}

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClientInterface) {}

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return null;
    }

    return this.mapToDomain(userData);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userData) {
      return null;
    }

    return this.mapToDomain(userData);
  }

  async save(user: User): Promise<User> {
    const userData = user.toPersistence();

    const savedUser = await this.prisma.user.create({
      data: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        hashedPassword: userData.hashedPassword,
        status: userData.status,
        emailVerified: userData.emailVerified,
        lastLoginAt: userData.lastLoginAt,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });

    return this.mapToDomain(savedUser);
  }

  async update(user: User): Promise<User> {
    const userData = user.toPersistence();

    const updatedUser = await this.prisma.user.update({
      where: { id: userData.id },
      data: {
        email: userData.email,
        name: userData.name,
        hashedPassword: userData.hashedPassword,
        status: userData.status,
        emailVerified: userData.emailVerified,
        lastLoginAt: userData.lastLoginAt,
        updatedAt: userData.updatedAt,
      },
    });

    return this.mapToDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async findAll(limit = 10, offset = 0): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user: any) => this.mapToDomain(user));
  }

  async count(): Promise<number> {
    return await this.prisma.user.count();
  }

  private mapToDomain(userData: any): User {
    return User.reconstruct(
      userData.id,
      userData.email,
      userData.name,
      userData.hashedPassword,
      userData.status as UserStatus,
      userData.emailVerified,
      userData.lastLoginAt,
      userData.createdAt,
      userData.updatedAt
    );
  }
}
