import React, { useState, useMemo } from 'react';
// FIX: Add file extensions to imports to resolve modules.
import type { CartItem, OrderPayload, DeliveryOption } from '../../types.ts';
// FIX: Add file extension to api.ts import.
import { DELIVERY_OPTIONS } from '../../api.ts';
import { LockIcon } from '../icons/LockIcon.tsx';
import { CreditCardIcon } from '../icons/CreditCardIcon.tsx';

interface CheckoutPageProps {
    items: CartItem[];
    onSubmitOrder: (orderDetails: OrderPayload) => Promise<void>;
    onBackToHome: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onSubmitOrder, onBackToHome }) => {
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(DELIVERY_OPTIONS[0]);
    const [customerDetails, setCustomerDetails] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);
    const total = subtotal + selectedDelivery.price;
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        const orderPayload: OrderPayload = {
            items,
            subtotal,
            shippingCost: selectedDelivery.price,
            total,
            customerDetails,
        };
        await onSubmitOrder(orderPayload);
        setIsProcessing(false);
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
                <p className="mt-4">Añade productos a tu carrito para poder finalizar la compra.</p>
                <button onClick={onBackToHome} className="mt-6 px-6 py-2 bg-a4coGreen text-a4coBlack font-bold rounded-full">
                    Volver a la tienda
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <h1 className="sr-only">Checkout</h1>

                    <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        <div>
                            {/* Contact Information */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Información de Contacto</h2>
                                <div className="mt-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" id="email" name="email" required onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <h2 className="text-lg font-medium text-gray-900">Dirección de Envío</h2>
                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
                                        <input type="text" id="firstName" name="firstName" required onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos</label>
                                        <input type="text" id="lastName" name="lastName" required onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                                        <input type="text" id="address" name="address" required onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                                        <input type="text" id="city" name="city" required onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Código Postal</label>
                                        <input type="text" id="postalCode" name="postalCode" required onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Delivery Method */}
                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <h2 className="text-lg font-medium text-gray-900">Método de Envío</h2>
                                <div className="mt-4 grid grid-cols-1 gap-y-4">
                                    {DELIVERY_OPTIONS.map((option, index) => (
                                        <div key={option.id} onClick={() => setSelectedDelivery(option)} className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none ${selectedDelivery.id === option.id ? 'border-a4coGreen ring-2 ring-a4coGreen' : 'border-gray-300'}`}>
                                            <div className="flex flex-1">
                                                <div className="flex flex-col">
                                                    <span className="block text-sm font-medium text-gray-900">{option.name}</span>
                                                    <span className="mt-1 flex items-center text-sm text-gray-500">{option.description}</span>
                                                    <span className="mt-6 text-sm font-medium text-gray-900">€{option.price.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <h2 className="text-lg font-medium text-gray-900">Pago</h2>
                                 <div className="mt-4 grid grid-cols-1 gap-y-4">
                                    {/* Simulated payment fields */}
                                    <div>
                                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Número de tarjeta</label>
                                        <div className="relative mt-1">
                                            <input type="text" id="card-number" name="card-number" placeholder="0000 0000 0000 0000" className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <CreditCardIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4">
                                        <div>
                                            <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">Fecha de caducidad (MM/AA)</label>
                                            <input type="text" id="expiration-date" name="expiration-date" placeholder="MM/AA" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                                            <div className="relative mt-1">
                                            <input type="text" id="cvc" name="cvc" placeholder="000" className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <LockIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="mt-10 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900">Resumen del pedido</h2>
                            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                                <ul role="list" className="divide-y divide-gray-200">
                                    {items.map(({ product, quantity }) => (
                                        <li key={product.id} className="flex py-6 px-4 sm:px-6">
                                            <div className="flex-shrink-0">
                                                <img src={product.imageUrl} alt={product.name} className="w-20 rounded-md" />
                                            </div>
                                            <div className="ml-6 flex flex-1 flex-col">
                                                <div className="flex">
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-sm"><a href="#" className="font-medium text-gray-700 hover:text-gray-800">{product.name}</a></h4>
                                                        <p className="mt-1 text-sm text-gray-500">Cantidad: {quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between pt-2">
                                                    <p className="mt-1 text-sm font-medium text-gray-900">€{(product.price * quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm">Subtotal</dt>
                                        <dd className="text-sm font-medium text-gray-900">€{subtotal.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm">Envío</dt>
                                        <dd className="text-sm font-medium text-gray-900">€{selectedDelivery.price.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                                        <dt className="text-base font-medium">Total</dt>
                                        <dd className="text-base font-medium text-gray-900">€{total.toFixed(2)}</dd>
                                    </div>
                                </dl>
                                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <button type="submit" disabled={isProcessing} className="w-full rounded-md border border-transparent bg-a4coGreen py-3 px-4 text-base font-bold text-a4coBlack shadow-sm hover:bg-a4coBlack hover:text-white focus:outline-none focus:ring-2 focus:ring-a4coGreen focus:ring-offset-2 focus:ring-offset-gray-50 disabled:cursor-not-allowed disabled:bg-gray-300">
                                        {isProcessing ? 'Procesando...' : 'Pagar ahora'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;