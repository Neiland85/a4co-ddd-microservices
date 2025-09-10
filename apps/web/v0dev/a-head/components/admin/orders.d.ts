import type { Order } from '@/types/admin-types';
interface AdminOrdersProps {
    orders: Order[];
    onView?: (order: Order) => void;
    onUpdateStatus?: (orderId: string, status: Order['status']) => void;
}
export declare function AdminOrders({ orders, onView, onUpdateStatus }: AdminOrdersProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=orders.d.ts.map