import { v4 as uuidv4 } from 'uuid';

export class UserId {
  private constructor(public readonly value: string) {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }
  }

  static create(value: string): UserId {
    return new UserId(value);
  }

  static generate(): UserId {
    return new UserId(uuidv4());
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
