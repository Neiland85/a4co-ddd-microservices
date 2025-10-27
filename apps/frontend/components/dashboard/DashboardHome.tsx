// FIX: Implement the dashboard home/summary component.
import React from 'react';
import type { Order, DashboardStats } from '../../types.ts';
import { ClipboardListIcon } from '../icons/ClipboardListIcon.tsx';
import { BoxIcon } from '../icons/BoxIcon.tsx';

// A helper icon component defined within this file to avoid creating new files.
const CurrencyEuroIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


interface DashboardHomeProps {
    stats: DashboardStats;
    orders: Order[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="p-3 rounded-full bg-a4coGreen/20 text-a4coGreen mr-4">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);


const DashboardHome: React.FC<DashboardHomeProps> = ({ stats, orders }) => {
    const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    const statusColors: { [key in Order['status']]: string } = {
        'Pendiente': 'bg-yellow-100 text-yellow-800',
        'Enviado': 'bg-blue-100 text-blue-800',
        'Entregado': 'bg-green-100 text-green-800',
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Resumen del Panel</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Ingresos Totales (Entregado)" value={`€${stats.totalRevenue.toFixed(2)}`} icon={CurrencyEuroIcon} />
                <StatCard title="Pedidos Pendientes" value={stats.pendingOrders} icon={ClipboardListIcon} />
                <StatCard title="Artículos con Bajo Stock" value={stats.lowStockItems} icon={BoxIcon} />
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Pedidos Recientes</h2>
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
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">#{order.id.slice(-6)}</div>
                                        <div className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerDetails.firstName} {order.customerDetails.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">No hay pedidos recientes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;