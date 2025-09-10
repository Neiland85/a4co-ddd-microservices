"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsSchema = exports.OrderSchema = exports.ProductSchema = void 0;
const zod_1 = require("zod");
// Product Types
exports.ProductSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1, 'El nombre es requerido'),
    category: zod_1.z.enum([
        'panaderia',
        'queseria',
        'aceite',
        'embutidos',
        'miel',
        'conservas',
        'vinos',
        'dulces',
        'artesania',
    ]),
    price: zod_1.z.number().min(0, 'El precio debe ser positivo'),
    stock: zod_1.z.number().int().min(0, 'El stock debe ser un número entero positivo'),
    description: zod_1.z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    image: zod_1.z.string().url('Debe ser una URL válida').optional(),
    status: zod_1.z.enum(['active', 'inactive', 'out_of_stock']),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Order Types
exports.OrderSchema = zod_1.z.object({
    id: zod_1.z.string(),
    customerName: zod_1.z.string(),
    customerEmail: zod_1.z.string().email(),
    products: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string(),
        productName: zod_1.z.string(),
        quantity: zod_1.z.number(),
        price: zod_1.z.number(),
    })),
    total: zod_1.z.number(),
    status: zod_1.z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Settings Types
exports.SettingsSchema = zod_1.z.object({
    businessName: zod_1.z.string().min(1, 'El nombre del negocio es requerido'),
    email: zod_1.z.string().email('Email inválido'),
    phone: zod_1.z.string().min(9, 'Teléfono inválido'),
    address: zod_1.z.string().min(5, 'Dirección requerida'),
    description: zod_1.z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
    notifications: zod_1.z.object({
        email: zod_1.z.boolean(),
        sms: zod_1.z.boolean(),
        push: zod_1.z.boolean(),
    }),
    privacy: zod_1.z.object({
        dataRetention: zod_1.z.number().min(1).max(120), // months
        cookieConsent: zod_1.z.boolean(),
        analyticsEnabled: zod_1.z.boolean(),
    }),
});
//# sourceMappingURL=admin-types.js.map