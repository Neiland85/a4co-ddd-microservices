import React, { useState } from 'react';
// FIX: Add file extension to types import to fix module resolution.
import type { Order } from '../../types.ts';

interface OrderManagerProps {
    orders: Order[];
    onUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const statusOptions: Order['status'][] = ['Pendiente', 'Enviado', 'Entregado'];

const statusColors: { [key in Order['status']]: string } = {
    'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Enviado': 'bg-blue-100 text-blue-800 border-blue-300',
    'Entregado': 'bg-green-100 text-green-800 border-green-300',
};

const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const OrderManager: React.FC<OrderManagerProps> = ({ orders, onUpdateOrderStatus }) => {
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        if (statusOptions.includes(newStatus as Order['status'])) {
            setUpdatingOrderId(orderId);
            try {
                await onUpdateOrderStatus(orderId, newStatus as Order['status']);
            } catch (error) {
                console.error("Failed to update status:", error);
                // Optionally show an error to the user
            } finally {
                setUpdatingOrderId(null);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Gestionar Pedidos</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length > 0 ? orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">#{order.id.slice(-6)}</div>
                                    <div className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerDetails.firstName} {order.customerDetails.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            disabled={updatingOrderId === order.id}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border focus:ring-a4coGreen focus:border-a4coGreen transition-colors ${statusColors[order.status]} ${updatingOrderId === order.id ? 'cursor-not-allowed' : ''}`}
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        {updatingOrderId === order.id && <SpinnerIcon />}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                             <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-500">No hay pedidos para mostrar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManager;