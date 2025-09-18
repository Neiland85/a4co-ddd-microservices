"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationSchema = exports.registrationSchema = exports.a4coSignupSchema = void 0;
const zod_1 = require("zod");
// Esquema para el formulario de registro a4co
exports.a4coSignupSchema = zod_1.z
    .object({
    firstName: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: zod_1.z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: zod_1.z.string().email('Ingresa un correo electrónico válido'),
    phone: zod_1.z.string().optional(),
    company: zod_1.z.string().min(2, 'El nombre de la empresa debe tener al menos 2 caracteres'),
    jobTitle: zod_1.z.string().min(2, 'Selecciona un cargo válido'),
    password: zod_1.z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: zod_1.z.string(),
    acceptTerms: zod_1.z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
    newsletter: zod_1.z.boolean().optional(),
})
    .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});
// Esquema para el formulario de registro general
exports.registrationSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: zod_1.z.string().email('Ingresa un correo electrónico válido'),
    password: zod_1.z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: zod_1.z.string(),
    phone: zod_1.z.string().optional(),
    acceptTerms: zod_1.z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
    marketingEmails: zod_1.z.boolean().optional(),
})
    .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});
// Esquema para verificación 2FA
exports.verificationSchema = zod_1.z.object({
    code: zod_1.z.string().length(6, 'El código debe tener 6 dígitos'),
});
//# sourceMappingURL=validation.js.map