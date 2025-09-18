import { User } from '../aggregates/user.aggregate';
export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    exists(email: string): Promise<boolean>;
    findAll(limit?: number, offset?: number): Promise<User[]>;
    count(): Promise<number>;
}
//# sourceMappingURL=user.repository.d.ts.map