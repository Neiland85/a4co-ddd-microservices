import React from 'react';
// FIX: Add file extensions to imports to resolve modules.
import type { User, Order, Product, Producer } from '../../types.ts';
import ProductCard from '../ProductCard.tsx';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon.tsx';

interface UserDashboardProps {
    currentUser: User;
    orders: Order[];
    products: Product[];
    producers: Producer[];
    onBack: () => void;
    onProductSelect: (product: Product) => void;
    onProducerSelect: (producerId: string) => void;
    onToggleFavorite: (productId: string) => void;
    // FIX: Add onLogout prop to satisfy App.tsx props.
    onLogout: () => void;
}

const statusColors: { [key in Order['status']]: string } = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'Enviado': 'bg-blue-100 text-blue-800',
    'Entregado': 'bg-green-100 text-green-800',
};


const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser, orders, products, producers, onBack, onProductSelect, onProducerSelect, onToggleFavorite, onLogout }) => {
    
    const favoriteProducts = products.filter(p => currentUser.favoriteProductIds.includes(p.id));

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-a4coBlack mb-8">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Volver a la tienda
                </button>

                <div className="bg-white rounded-lg shadow-md p-8 mb-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Hola, {currentUser.name}</h1>
                            <p className="mt-2 text-gray-600">{currentUser.email}</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Favorite Products */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Tus Productos Favoritos</h2>
                    {favoriteProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {favoriteProducts.map(product => (
                                 <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    producers={producers}
                                    onSelect={onProductSelect}
                                    onProducerSelect={onProducerSelect}
                                    isFavorite={true}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm">Aún no has añadido ningún producto a favoritos.</p>
                    )}
                </section>

                {/* Order History */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Pedidos</h2>
                     <div className="bg-white rounded-lg shadow-md">
                        <ul role="list" className="divide-y divide-gray-200">
                            {orders.length > 0 ? orders.map(order => (
                                <li key={order.id} className="p-6">
                                    <div className="flex justify-between items-center flex-wrap gap-4">
                                        <div>
                                            <p className="font-semibold text-a4coBlack">Pedido #{order.id}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-sm text-gray-500">
                                                    Fecha: {new Date(order.date).toLocaleDateString('es-ES')}
                                                </p>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-lg text-gray-800">€{order.total.toFixed(2)}</p>
                                    </div>
                                    <div className="mt-4 border-t pt-4">
                                        <h4 className="text-sm font-medium text-gray-600 mb-2">Artículos:</h4>
                                        {order.items.map(item => (
                                            <div key={item.product.id} className="flex items-center justify-between text-sm text-gray-500">
                                                <p>{item.product.name} (x{item.quantity})</p>
                                                <p>€{(item.product.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            )) : (
                                <li className="p-6 text-center text-gray-500">No has realizado ningún pedido todavía.</li>
                            )}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;