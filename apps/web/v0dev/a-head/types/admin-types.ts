import type React from 'react';
import { z } from 'zod';

// Product Types
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.enum([
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
  price: z.number().min(0, 'El precio debe ser positivo'),
  stock: z.number().int().min(0, 'El stock debe ser un número entero positivo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  images: z.array(z.string().url('Debe ser una URL válida')).optional(),
  producer: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;

// Order Types
export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.number(),
      price: z.number(),
      total: z.number(),
    })
  ),
  total: z.number(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

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

// Settings Types
export const SettingsSchema = z.object({
  businessName: z.string().min(1, 'El nombre del negocio es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  address: z.string().min(5, 'Dirección requerida'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  privacy: z.object({
    dataRetention: z.number().min(1).max(120), // months
    cookieConsent: z.boolean(),
    analyticsEnabled: z.boolean(),
  }),
});

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

// GDPR Types
export interface DataRequest {
  id: string;
  type: 'access' | 'deletion' | 'export';
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestDate: Date;
  completedDate?: Date;
  notes?: string;
}

// Dashboard Types
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

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

// Admin User Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'editor';
  avatar?: string;
  lastLogin: Date;
  isActive: boolean;
}
