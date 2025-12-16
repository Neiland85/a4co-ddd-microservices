/**
 * Address primitives for serialization/deserialization
 */
export interface AddressPrimitives {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Address Value Object
 * Represents a physical address
 * 
 * @invariant all fields must be non-empty strings
 * @invariant postalCode must be valid format
 */
export class Address {
  private constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly state: string,
    public readonly postalCode: string,
    public readonly country: string,
  ) {
    this.validate();
  }

  /**
   * Create an Address instance
   */
  static create(
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: string,
  ): Address {
    return new Address(
      street.trim(),
      city.trim(),
      state.trim(),
      postalCode.trim(),
      country.trim(),
    );
  }

  /**
   * Create Address from primitives
   */
  static fromPrimitives(primitives: AddressPrimitives): Address {
    return Address.create(
      primitives.street,
      primitives.city,
      primitives.state,
      primitives.postalCode,
      primitives.country,
    );
  }

  /**
   * Validate the address
   */
  private validate(): void {
    if (!this.street || this.street.length === 0) {
      throw new Error('Street cannot be empty');
    }

    if (!this.city || this.city.length === 0) {
      throw new Error('City cannot be empty');
    }

    if (!this.state || this.state.length === 0) {
      throw new Error('State cannot be empty');
    }

    if (!this.postalCode || this.postalCode.length === 0) {
      throw new Error('Postal code cannot be empty');
    }

    if (!this.country || this.country.length === 0) {
      throw new Error('Country cannot be empty');
    }
  }

  /**
   * Check if this address equals another
   */
  equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.postalCode === other.postalCode &&
      this.country === other.country
    );
  }

  /**
   * Convert to primitives for persistence
   */
  toPrimitives(): AddressPrimitives {
    return {
      street: this.street,
      city: this.city,
      state: this.state,
      postalCode: this.postalCode,
      country: this.country,
    };
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.postalCode}, ${this.country}`;
  }
}
