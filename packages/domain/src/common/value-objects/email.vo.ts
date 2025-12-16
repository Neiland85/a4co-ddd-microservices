/**
 * Email Value Object
 * Represents a valid email address
 * 
 * @invariant email must be a valid email format
 */
export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(public readonly value: string) {
    this.validate();
  }

  /**
   * Create an Email instance
   */
  static create(email: string): Email {
    return new Email(email.toLowerCase().trim());
  }

  /**
   * Validate the email format
   */
  private validate(): void {
    if (!this.value || this.value.length === 0) {
      throw new Error('Email cannot be empty');
    }

    if (!Email.EMAIL_REGEX.test(this.value)) {
      throw new Error(`Invalid email format: ${this.value}`);
    }

    if (this.value.length > 255) {
      throw new Error('Email cannot exceed 255 characters');
    }
  }

  /**
   * Check if this email equals another
   */
  equals(other: Email): boolean {
    return this.value === other.value;
  }

  /**
   * Get the domain part of the email
   */
  getDomain(): string {
    return this.value.split('@')[1];
  }

  /**
   * Get the local part of the email
   */
  getLocalPart(): string {
    return this.value.split('@')[0];
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.value;
  }
}
