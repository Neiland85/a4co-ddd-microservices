import type React from "react"
import { z } from "zod"

// Product Types
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre es requerido"),
  category: z.enum([
    "panaderia",
    "queseria",
    "aceite",
    "embutidos",
    "miel",
    "conservas",
    "vinos",
    "dulces",
    "artesania",
  ]),
  price: z.number().min(0, "El precio debe ser positivo"),
  stock: z.number().int().min(0, "El stock debe ser un número entero positivo"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  image: z.string().url("Debe ser una URL válida").optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Product = z.infer<typeof ProductSchema>

// Order Types
export const OrderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  products: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  total: z.number(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Order = z.infer<typeof OrderSchema>

// Settings Types
export const SettingsSchema = z.object({
  businessName: z.string().min(1, "El nombre del negocio es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  address: z.string().min(5, "Dirección requerida"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
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
})

export type Settings = z.infer<typeof SettingsSchema>

// GDPR Types
export interface DataRequest {
  id: string
  type: "access" | "deletion" | "export"
  customerEmail: string
  status: "pending" | "processing" | "completed" | "rejected"
  requestDate: Date
  completedDate?: Date
  notes?: string
}

// Dashboard Types
export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
  recentOrders: Order[]
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
}

// Navigation Types
export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: number
}
