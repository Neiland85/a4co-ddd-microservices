// FIX: Implement the main producer Dashboard component.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Product, Category, Order, Producer, DashboardStats } from '../../types.ts';
// FIX: Add file extension to api.ts import.
import * as api from '../../api.ts';

import DashboardSidebar from './DashboardSidebar.tsx';
import DashboardHome from './DashboardHome.tsx';
import ProductManager from './ProductManager.tsx';
import OrderManager from './OrderManager.tsx';
import ProfileManager from './ProfileManager.tsx';

type DashboardView = 'home' | 'products' | 'orders' | 'profile';

interface DashboardProps {
    currentUser: User;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
    const [view, setView] = useState<DashboardView>('home');
    const [producerProducts, setProducerProducts] = useState<Product[]>([]);
    const [producerOrders, setProducerOrders] = useState<Order[]>([]);
    const [producerProfile, setProducerProfile] = useState<Producer | null>(null);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const producerId = currentUser.producerId;

    const fetchData = useCallback(async () => {
        if (!producerId) {
            setError("No se pudo encontrar el ID del productor.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [productsData, ordersData, producersData, categoriesData] = await Promise.all([
                api.getProducts(),
                api.getOrdersByProducer(producerId),
                api.getProducers(),
                api.getCategories(),
            ]);

            setProducerProducts(productsData.filter(p => p.producerId === producerId));
            setProducerOrders(ordersData);
            setProducerProfile(producersData.find(p => p.id === producerId) || null);
            setAllCategories(categoriesData);

        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError("No se pudieron cargar los datos del panel.");
        } finally {
            setIsLoading(false);
        }
    }, [producerId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const stats = useMemo((): DashboardStats => {
        const totalRevenue = producerOrders
            .filter(o => o.status === 'Entregado')
            .reduce((sum, order) => sum + order.total, 0);
        
        const pendingOrders = producerOrders.filter(o => o.status === 'Pendiente').length;

        const lowStockItems = producerProducts.filter(p => p.stock <= 5).length;

        return { totalRevenue, pendingOrders, lowStockItems };
    }, [producerOrders, producerProducts]);

    const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            await api.updateOrderStatus(orderId, status);
            fetchData(); // Refresh data after update
        } catch (err) {
            console.error("Failed to update order status:", err);
            setError("Error al actualizar el estado del pedido.");
        }
    };

    const renderView = () => {
        if (isLoading) {
            return <div className="p-8 text-center">Cargando datos del productor...</div>;
        }
        if (error) {
            return <div className="p-8 text-center text-red-500">{error}</div>;
        }
        if (!producerProfile) {
            return <div className="p-8 text-center text-red-500">No se pudo cargar el perfil del productor.</div>;
        }

        switch (view) {
            case 'home':
                return <DashboardHome stats={stats} orders={producerOrders} />;
            case 'products':
                return <ProductManager products={producerProducts} categories={allCategories} producerId={producerId!} onProductsUpdate={fetchData} />;
            case 'orders':
                return <OrderManager orders={producerOrders} onUpdateOrderStatus={handleUpdateOrderStatus} />;
            case 'profile':
                return <ProfileManager producer={producerProfile} onProfileUpdate={fetchData} />;
            default:
                return <div>Vista no encontrada</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <DashboardSidebar
                currentView={view}
                onSelectView={setView}
                onLogout={onLogout}
                producerName={producerProfile?.name || currentUser.name}
            />
            <main className="flex-1 ml-64 p-8">
                {renderView()}
            </main>
        </div>
    );
};

export default Dashboard;