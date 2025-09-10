'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAction = loginAction;
exports.registerAction = registerAction;
const zod_1 = require("zod");
const auth_1 = require("@/lib/validators/auth");
async function loginAction(prevState, formData) {
    try {
        const rawData = {
            email: formData.get('email'),
            password: formData.get('password'),
        };
        const validatedData = auth_1.loginSchema.parse(rawData);
        // Simulate authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock authentication logic
        if (validatedData.email === 'test@example.com' && validatedData.password === 'password123') {
            return {
                success: true,
                message: '¡Inicio de sesión exitoso! Bienvenido de vuelta.',
            };
        }
        else {
            return {
                success: false,
                message: 'Credenciales incorrectas. Intenta con test@example.com / password123',
            };
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return {
                success: false,
                message: 'Error de validación',
                errors: error.flatten().fieldErrors,
            };
        }
        return {
            success: false,
            message: 'Error interno del servidor',
        };
    }
}
async function registerAction(prevState, formData) {
    try {
        const rawData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            terms: formData.get('terms') === 'on',
        };
        const validatedData = auth_1.registerSchema.parse(rawData);
        // Simulate registration
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Mock registration logic
        return {
            success: true,
            message: '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.',
        };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return {
                success: false,
                message: 'Error de validación',
                errors: error.flatten().fieldErrors,
            };
        }
        return {
            success: false,
            message: 'Error interno del servidor',
        };
    }
}
//# sourceMappingURL=actions.js.map