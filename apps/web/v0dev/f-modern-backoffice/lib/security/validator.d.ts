import { z } from 'zod';
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const ipAddressSchema: z.ZodString;
export declare const userAgentSchema: z.ZodString;
export declare class InputValidator {
    static sanitizeHtml(input: string): string;
    static validateText(input: string, maxLength?: number): string;
    static detectSuspiciousPatterns(input: string): string[];
    static validateFile(file: File, allowedTypes: string[], maxSize: number): void;
}
//# sourceMappingURL=validator.d.ts.map