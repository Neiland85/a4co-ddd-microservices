import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { UserRepositoryPort } from '../../application/ports';
import { User, UserStatus } from '../../domain/aggregates';

/**
 * Implementación del repositorio de usuarios usando Prisma
 */
@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

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
        password: userData.hashedPassword,
        role: 'CUSTOMER', // Default role
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
        password: userData.hashedPassword,
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

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async findActiveUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user: any) => this.mapToDomain(user));
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map((user: any) => this.mapToDomain(user)),
      total,
      page,
      totalPages,
    };
  }

  private mapToDomain(userData: any): User {
    return User.reconstruct({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      hashedPassword: userData.password,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      lastLoginAt: undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }
}
