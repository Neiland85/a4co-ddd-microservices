import type React from 'react';
import { z } from 'zod';
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<["panaderia", "queseria", "aceite", "embutidos", "miel", "conservas", "vinos", "dulces", "artesania"]>;
    price: z.ZodNumber;
    stock: z.ZodNumber;
    description: z.ZodString;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    producer: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["active", "inactive", "draft"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "inactive" | "active" | "draft";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    category: "aceite" | "miel" | "conservas" | "embutidos" | "panaderia" | "queseria" | "dulces" | "vinos" | "artesania";
    price: number;
    stock: number;
    producer?: string | undefined;
    images?: string[] | undefined;
}, {
    name: string;
    status: "inactive" | "active" | "draft";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    category: "aceite" | "miel" | "conservas" | "embutidos" | "panaderia" | "queseria" | "dulces" | "vinos" | "artesania";
    price: number;
    stock: number;
    producer?: string | undefined;
    images?: string[] | undefined;
}>;
export type Product = z.infer<typeof ProductSchema>;
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    customerName: z.ZodString;
    customerEmail: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        productName: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        quantity: number;
        productId: string;
        price: number;
        productName: string;
    }, {
        total: number;
        quantity: number;
        productId: string;
        price: number;
        productName: string;
    }>, "many">;
    total: z.ZodNumber;
    status: z.ZodEnum<["pending", "processing", "shipped", "delivered", "cancelled"]>;
    shippingAddress: z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        zipCode: z.ZodString;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        state: string;
        country: string;
        street: string;
        city: string;
        zipCode: string;
    }, {
        state: string;
        country: string;
        street: string;
        city: string;
        zipCode: string;
    }>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    items: {
        total: number;
        quantity: number;
        productId: string;
        price: number;
        productName: string;
    }[];
    total: number;
    customerEmail: string;
    userId: string;
    customerName: string;
    shippingAddress: {
        state: string;
        country: string;
        street: string;
        city: string;
        zipCode: string;
    };
}, {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    items: {
        total: number;
        quantity: number;
        productId: string;
        price: number;
        productName: string;
    }[];
    total: number;
    customerEmail: string;
    userId: string;
    customerName: string;
    shippingAddress: {
        state: string;
        country: string;
        street: string;
        city: string;
        zipCode: string;
    };
}>;
export type Order = z.infer<typeof OrderSchema>;
export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}
export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
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
export interface AdminSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
}
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
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyGrowth: {
        users: number;
        products: number;
        orders: number;
        revenue: number;
    };
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
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'moderator' | 'editor';
    avatar?: string;
    lastLogin: Date;
    isActive: boolean;
}
//# sourceMappingURL=admin-types.d.ts.map