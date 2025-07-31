"use client"

import { AdminOrders } from "@/components/admin/orders"
import type { Order } from "@/types/admin-types"

// Mock data
const mockOrders: Order[] = [
  {
    id: "order-001",
    userId: "user-123",
    customerName: "María García",
    customerEmail: "maria@example.com",
    items: [
      {
        productId: "1",
        productName: "Aceite de Oliva Virgen Extra",
        quantity: 2,
        price: 24.99,
        total: 49.98,
      },
    ],
    total: 49.98,
    status: "pending",
    shippingAddress: {
      street: "Calle Mayor 123",
      city: "Jaén",
      state: "Andalucía",
      zipCode: "23001",
      country: "España",
    },
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "order-002",
    userId: "user-456",
    customerName: "Carlos López",
    customerEmail: "carlos@example.com",
    items: [
      {
        productId: "2",
        productName: "Cerámica Artesanal",
        quantity: 1,
        price: 35.5,
        total: 35.5,
      },
    ],
    total: 35.5,
    status: "processing",
    shippingAddress: {
      street: "Avenida Andalucía 45",
      city: "Úbeda",
      state: "Andalucía",
      zipCode: "23400",
      country: "España",
    },
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-19"),
  },
]

export default function AdminOrdersPage() {
  const handleView = (order: Order) => {
    console.log("Viewing order:", order.id)
  }

  const handleUpdateStatus = (orderId: string, status: Order["status"]) => {
    console.log("Updating order status:", orderId, status)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminOrders orders={mockOrders} onView={handleView} onUpdateStatus={handleUpdateStatus} />
      </div>
    </div>
  )
}
