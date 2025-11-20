export interface ValidationRule<T = unknown> {
    validate: (value: T) => boolean;
    message: string;
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare class Validator<T = unknown> {
    private rules;
    addRule(rule: ValidationRule<T>): this;
    validate(value: T): ValidationResult;
}
export declare const required: (message?: string) => ValidationRule<unknown>;
export declare const minLength: (min: number, message?: string) => ValidationRule<string>;
export declare const maxLength: (max: number, message?: string) => ValidationRule<string>;
export declare const email: (message?: string) => ValidationRule<string>;
export declare const min: (min: number, message?: string) => ValidationRule<number>;
export declare const max: (max: number, message?: string) => ValidationRule<number>;
export declare const pattern: (regex: RegExp, message: string) => ValidationRule<string>;
export declare const custom: <T>(validator: (value: T) => boolean, message: string) => ValidationRule<T>;
//# sourceMappingURL=validation-utils.d.ts.map