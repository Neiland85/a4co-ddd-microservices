import { ValueObject } from '../base-classes';

/**
 * Value Object para CustomerId con validación
 */
export class CustomerId extends ValueObject<string> {
    constructor(value: string) {
        super(value);
        if (!value || value.trim().length === 0) {
            throw new Error('CustomerId cannot be empty');
        }
        if (value.length < 3) {
            throw new Error('CustomerId must be at least 3 characters long');
        }
        if (value.length > 100) {
            throw new Error('CustomerId cannot exceed 100 characters');
        }
        // Validar formato UUID si es necesario
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value) && !/^[a-zA-Z0-9_-]+$/.test(value)) {
            throw new Error('CustomerId must be a valid UUID or alphanumeric string');
        }
    }
}
