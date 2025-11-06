import { ValueObject } from '../base-classes';

export interface AddressData {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export class Address extends ValueObject<AddressData> {
  constructor(data: AddressData) {
    if (!data.street || data.street.trim().length === 0) {
      throw new Error('Street cannot be empty');
    }
    if (!data.city || data.city.trim().length === 0) {
      throw new Error('City cannot be empty');
    }
    if (!data.postalCode || data.postalCode.trim().length === 0) {
      throw new Error('Postal code cannot be empty');
    }
    if (!data.country || data.country.trim().length === 0) {
      throw new Error('Country cannot be empty');
    }
    if (data.country.length !== 2) {
      throw new Error('Country must be a 2-letter ISO code');
    }
    super({
      street: data.street.trim(),
      city: data.city.trim(),
      state: data.state?.trim(),
      postalCode: data.postalCode.trim(),
      country: data.country.toUpperCase().trim(),
    });
  }

  get street(): string {
    return this.value.street;
  }

  get city(): string {
    return this.value.city;
  }

  get state(): string | undefined {
    return this.value.state;
  }

  get postalCode(): string {
    return this.value.postalCode;
  }

  get country(): string {
    return this.value.country;
  }

  toString(): string {
    const parts = [
      this.street,
      this.city,
      this.state,
      this.postalCode,
      this.country,
    ].filter(Boolean);
    return parts.join(', ');
  }
}
