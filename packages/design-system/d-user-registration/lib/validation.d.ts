import { z } from 'zod';
export declare const a4coSignupSchema: z.ZodEffects<z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    company: z.ZodString;
    jobTitle: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    acceptTerms: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    newsletter: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    company: string;
    jobTitle: string;
    acceptTerms: boolean;
    phone?: string | undefined;
    newsletter?: boolean | undefined;
}, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    company: string;
    jobTitle: string;
    acceptTerms: boolean;
    phone?: string | undefined;
    newsletter?: boolean | undefined;
}>, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    company: string;
    jobTitle: string;
    acceptTerms: boolean;
    phone?: string | undefined;
    newsletter?: boolean | undefined;
}, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    company: string;
    jobTitle: string;
    acceptTerms: boolean;
    phone?: string | undefined;
    newsletter?: boolean | undefined;
}>;
export type A4coSignupFormData = z.infer<typeof a4coSignupSchema>;
export declare const registrationSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    acceptTerms: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    marketingEmails: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    phone?: string | undefined;
    marketingEmails?: boolean | undefined;
}, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    phone?: string | undefined;
    marketingEmails?: boolean | undefined;
}>, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    phone?: string | undefined;
    marketingEmails?: boolean | undefined;
}, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    phone?: string | undefined;
    marketingEmails?: boolean | undefined;
}>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export declare const verificationSchema: z.ZodObject<{
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>;
export type VerificationFormData = z.infer<typeof verificationSchema>;
//# sourceMappingURL=validation.d.ts.map