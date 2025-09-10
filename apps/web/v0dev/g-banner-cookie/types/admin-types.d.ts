import type React from 'react';
import { z } from 'zod';
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<["panaderia", "queseria", "aceite", "embutidos", "miel", "conservas", "vinos", "dulces", "artesania"]>;
    price: z.ZodNumber;
    stock: z.ZodNumber;
    description: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["active", "inactive", "out_of_stock"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "inactive" | "active" | "out_of_stock";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    category: "aceite" | "miel" | "conservas" | "embutidos" | "panaderia" | "queseria" | "dulces" | "vinos" | "artesania";
    price: number;
    stock: number;
    image?: string | undefined;
}, {
    name: string;
    status: "inactive" | "active" | "out_of_stock";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    category: "aceite" | "miel" | "conservas" | "embutidos" | "panaderia" | "queseria" | "dulces" | "vinos" | "artesania";
    price: number;
    stock: number;
    image?: string | undefined;
}>;
export type Product = z.infer<typeof ProductSchema>;
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodString;
    customerName: z.ZodString;
    customerEmail: z.ZodString;
    products: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        productName: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        productId: string;
        price: number;
        productName: string;
    }, {
        quantity: number;
        productId: string;
        price: number;
        productName: string;
    }>, "many">;
    total: z.ZodNumber;
    status: z.ZodEnum<["pending", "processing", "shipped", "delivered", "cancelled"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    total: number;
    products: {
        quantity: number;
        productId: string;
        price: number;
        productName: string;
    }[];
    customerEmail: string;
    customerName: string;
}, {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    total: number;
    products: {
        quantity: number;
        productId: string;
        price: number;
        productName: string;
    }[];
    customerEmail: string;
    customerName: string;
}>;
export type Order = z.infer<typeof OrderSchema>;
export declare const SettingsSchema: z.ZodObject<{
    businessName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    address: z.ZodString;
    description: z.ZodString;
    notifications: z.ZodObject<{
        email: z.ZodBoolean;
        sms: z.ZodBoolean;
        push: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        push: boolean;
        email: boolean;
        sms: boolean;
    }, {
        push: boolean;
        email: boolean;
        sms: boolean;
    }>;
    privacy: z.ZodObject<{
        dataRetention: z.ZodNumber;
        cookieConsent: z.ZodBoolean;
        analyticsEnabled: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        dataRetention: number;
        cookieConsent: boolean;
        analyticsEnabled: boolean;
    }, {
        dataRetention: number;
        cookieConsent: boolean;
        analyticsEnabled: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    email: string;
    description: string;
    notifications: {
        push: boolean;
        email: boolean;
        sms: boolean;
    };
    address: string;
    businessName: string;
    phone: string;
    privacy: {
        dataRetention: number;
        cookieConsent: boolean;
        analyticsEnabled: boolean;
    };
}, {
    email: string;
    description: string;
    notifications: {
        push: boolean;
        email: boolean;
        sms: boolean;
    };
    address: string;
    businessName: string;
    phone: string;
    privacy: {
        dataRetention: number;
        cookieConsent: boolean;
        analyticsEnabled: boolean;
    };
}>;
export type Settings = z.infer<typeof SettingsSchema>;
export interface DataRequest {
    id: string;
    type: 'access' | 'deletion' | 'export';
    customerEmail: string;
    status: 'pending' | 'processing' | 'completed' | 'rejected';
    requestDate: Date;
    completedDate?: Date;
    notes?: string;
}
export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    lowStockProducts: number;
    recentOrders: Order[];
    topProducts: Array<{
        id: string;
        name: string;
        sales: number;
        revenue: number;
    }>;
}
export interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
    href: string;
    badge?: number;
}
//# sourceMappingURL=admin-types.d.ts.map