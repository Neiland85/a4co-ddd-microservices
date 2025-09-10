import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/aggregates/user.aggregate';
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
export declare class PrismaUserRepository implements UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaClientInterface);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    exists(email: string): Promise<boolean>;
    findAll(limit?: number, offset?: number): Promise<User[]>;
    count(): Promise<number>;
    private mapToDomain;
}
export {};
//# sourceMappingURL=prisma-user.repository.d.ts.map