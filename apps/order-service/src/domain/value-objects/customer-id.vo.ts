import { ValueObject } from '../base-classes';

export class CustomerId extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    if (!value || value.trim().length === 0) {
      throw new Error('CustomerId cannot be empty');
    }
    if (value.length < 3) {
      throw new Error('CustomerId must be at least 3 characters long');
    }
  }
}
