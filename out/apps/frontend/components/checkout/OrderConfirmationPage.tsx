import React from 'react';
// FIX: Add file extension to types import to resolve module.
import type { Order } from '../../types.ts';
import { CheckCircleIcon } from '../icons/CheckCircleIcon.tsx';

interface OrderConfirmationPageProps {
    order: Order;
    onContinueShopping: () => void;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, onContinueShopping }) => {
    return (
        <div className="bg-white">
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="max-w-xl mx-auto text-center">
                    <CheckCircleIcon className="w-16 h-16 text-a4coGreen mx-auto" />
                    <h1 className="text-4xl font-bold tracking-tight text-a4coBlack sm:text-5xl mt-4">¡Gracias por tu pedido!</h1>
                    <p className="mt-4 text-base text-gray-500">
                        Hemos recibido tu pedido y lo estamos procesando. Tu número de pedido es{' '}
                        <span className="font-medium text-a4coBlack">{order.id}</span>.
                        Recibirás una confirmación por email en breve.
                    </p>
                </div>

                <section aria-labelledby="order-heading" className="mt-10 border-t border-gray-200">
                    <h2 id="order-heading" className="sr-only">Tu pedido</h2>
                    <ul role="list" className="divide-y divide-gray-200">
                        {order.items.map(({ product, quantity }) => (
                            <li key={product.id} className="flex space-x-6 py-6">
                                <img src={product.imageUrl} alt={product.name} className="h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center" />
                                <div className="flex flex-auto flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                                        <p className="text-sm text-gray-500">Cantidad: {quantity}</p>
                                    </div>
                                </div>
                                <p className="flex-none font-medium text-gray-900">€{(product.price * quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>

                    <dl className="mt-6 space-y-4 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                        <div className="flex justify-between">
                            <dt>Subtotal</dt>
                            <dd className="text-gray-900">€{order.subtotal.toFixed(2)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>Envío</dt>
                            <dd className="text-gray-900">€{order.shippingCost.toFixed(2)}</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-900/10 pt-4 text-gray-900">
                            <dt className="text-base">Total</dt>
                            <dd className="text-base">€{order.total.toFixed(2)}</dd>
                        </div>
                    </dl>
                </section>
                
                 <div className="mt-16 text-center">
                    <button
                        onClick={onContinueShopping}
                        className="rounded-md border border-transparent bg-a4coGreen py-3 px-8 text-base font-bold text-a4coBlack shadow-sm hover:bg-a4coBlack hover:text-white"
                    >
                        Seguir comprando
                    </button>
                </div>
            </main>
        </div>
    );
};

export default OrderConfirmationPage;