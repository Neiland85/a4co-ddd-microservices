export * from './base-classes';
export * from './aggregates/user.aggregate';

// Need to import for the interface
import { User } from './aggregates/user.aggregate';

// PORTS/INTERFACES

export interface IUserRepository {
    save(user: User): Promise<void>;
    findById(userId: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}
