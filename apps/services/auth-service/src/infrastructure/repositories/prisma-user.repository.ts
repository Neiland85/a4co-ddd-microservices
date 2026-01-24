import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../application/ports/user-repository.port';
import { User, UserStatus } from '../../domain/aggregates/user.aggregate';

/**
 * Interface mínima del cliente Prisma.
 * Evita acoplar el dominio o el repositorio a Prisma directamente.
 */
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
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaClientInterface) {}

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    return userData ? this.mapToDomain(userData) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });

    return userData ? this.mapToDomain(userData) : null;
  }

  async save(user: User): Promise<User> {
    const data = user.toPersistence();

    const savedUser = await this.prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        hashedPassword: data.hashedPassword,
        status: data.status,
        emailVerified: data.emailVerified,
        lastLoginAt: data.lastLoginAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return this.mapToDomain(savedUser);
  }

  async update(user: User): Promise<User> {
    const data = user.toPersistence();

    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email,
        name: data.name,
        hashedPassword: data.hashedPassword,
        status: data.status,
        emailVerified: data.emailVerified,
        lastLoginAt: data.lastLoginAt,
        updatedAt: data.updatedAt,
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

  async existsByEmail(email: string): Promise<boolean> {
    return this.exists(email);
  }

  async findActiveUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { status: UserStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u: any) => this.mapToDomain(u));
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

    return {
      users: users.map((u: any) => this.mapToDomain(u)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(limit = 10, offset = 0): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u: any) => this.mapToDomain(u));
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  /**
   * 🔑 ÚNICO punto de reconstrucción del aggregate desde persistencia
   * Alineado con User.reconstruct(data)
   */
  private mapToDomain(userData: any): User {
    return User.reconstruct({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      hashedPassword: userData.hashedPassword,
      status: userData.status as UserStatus,
      emailVerified: userData.emailVerified,
      lastLoginAt: userData.lastLoginAt ?? undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }
}
