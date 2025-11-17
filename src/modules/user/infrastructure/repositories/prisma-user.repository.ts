import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { UserRepositoryPort } from '../../application/ports/user-repository.port';
import { User } from '../../domain/aggregates/user.aggregate';

/**
 * Implementación del repositorio de usuarios usando Prisma
 *
 * Mapea entre el modelo de dominio (User Aggregate) y el modelo de Prisma
 */
@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    // NOTA: El schema actual de Prisma no tiene 'username' ni 'isActive'
    // Por ahora, mapeamos 'username' a 'name' y 'isActive' se maneja en memoria
    // TODO: Actualizar schema.prisma para agregar estos campos cuando sea posible
    const data = {
      id: user.id,
      name: user.username, // Mapear username a name (temporal)
      email: user.email,
      password: '', // Campo requerido en schema, vacío por ahora
      // isActive no existe en schema actual
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const prismaUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: data.name,
        email: data.email,
        updatedAt: data.updatedAt,
      },
      create: data,
    });

    return this.toDomain(prismaUser);
  }

  async findById(userId: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    // NOTA: Buscamos por 'name' ya que el schema no tiene 'username'
    const prismaUser = await this.prisma.user.findFirst({
      where: { name: username },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findAll(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return prismaUsers.map((prismaUser) => this.toDomain(prismaUser));
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Convierte un modelo de Prisma a un User Aggregate de dominio
   * NOTA: isActive se fija en true por defecto ya que no existe en el schema actual
   */
  private toDomain(prismaUser: any): User {
    return User.reconstruct(
      prismaUser.id,
      prismaUser.name, // name -> username
      prismaUser.email,
      true, // isActive (no existe en schema, asumimos true)
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}
