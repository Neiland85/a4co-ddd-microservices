import { User, IUserRepository } from '../../domain';

export class InMemoryUserRepository implements IUserRepository {
    private users = new Map<string, User>();

    async save(user: User): Promise<void> {
        this.users.set(user.id, user);
    }

    async findById(userId: string): Promise<User | null> {
        return this.users.get(userId) || null;
    }

    async findByUsername(username: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.username.value === username) {
                return user;
            }
        }
        return null;
    }

    async findByEmail(email: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.email.value === email) {
                return user;
            }
        }
        return null;
    }

    async findAll(): Promise<User[]> {
        return Array.from(this.users.values());
    }
}