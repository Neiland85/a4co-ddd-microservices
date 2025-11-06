import { ValueObject } from '../base-classes';

/**
 * Value Object para Address (dirección de envío)
 */
export class Address extends ValueObject<{
    street: string;
    city: string;
    postalCode: string;
    country: string;
    state?: string;
}> {
    constructor(
        street: string,
        city: string,
        postalCode: string,
        country: string,
        state?: string,
    ) {
        if (!street || street.trim().length === 0) {
            throw new Error('Street address cannot be empty');
        }
        if (street.length > 200) {
            throw new Error('Street address cannot exceed 200 characters');
        }

        if (!city || city.trim().length === 0) {
            throw new Error('City cannot be empty');
        }
        if (city.length > 100) {
            throw new Error('City cannot exceed 100 characters');
        }

        if (!postalCode || postalCode.trim().length === 0) {
            throw new Error('Postal code cannot be empty');
        }
        if (postalCode.length > 20) {
            throw new Error('Postal code cannot exceed 20 characters');
        }

        if (!country || country.trim().length === 0) {
            throw new Error('Country cannot be empty');
        }
        if (country.length !== 2) {
            throw new Error('Country must be a 2-letter ISO code (e.g., ES, US)');
        }

        super({
            street: street.trim(),
            city: city.trim(),
            postalCode: postalCode.trim(),
            country: country.toUpperCase().trim(),
            state: state?.trim(),
        });
    }

    get street(): string {
        return this.value.street;
    }

    get city(): string {
        return this.value.city;
    }

    get postalCode(): string {
        return this.value.postalCode;
    }

    get country(): string {
        return this.value.country;
    }

    get state(): string | undefined {
        return this.value.state;
    }

    /**
     * Representación completa de la dirección
     */
    toString(): string {
        const parts = [
            this.street,
            this.city,
            this.postalCode,
            this.state,
            this.country,
        ].filter(Boolean);
        return parts.join(', ');
    }

    /**
     * Representación en formato de línea única
     */
    toSingleLine(): string {
        return this.toString();
    }
}
