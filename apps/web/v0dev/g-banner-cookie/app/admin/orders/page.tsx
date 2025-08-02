import { Suspense } from "react"
import dynamic from "next/dynamic"
import AdminLayout from "../../../components/admin/admin-layout"
import { Loader2 } from "lucide-react"

// Lazy load the Orders component
const Orders = dynamic(() => import("../../../components/admin/orders"), {
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-2 text-a4co-olive-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="font-medium">Cargando pedidos...</span>
      </div>
    </div>
  ),
})

export default function OrdersPage() {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2 text-a4co-olive-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Cargando pedidos...</span>
            </div>
          </div>
        }
      >
        <Orders />
      </Suspense>
    </AdminLayout>
  )
}
