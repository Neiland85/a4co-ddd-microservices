

import React from 'react';
import { XIcon } from './icons/XIcon.tsx';
// FIX: Add Producer type to imports.
import type { CartItem, Producer } from '../types.ts';
import { PlusIcon } from './icons/PlusIcon.tsx';
import { MinusIcon } from './icons/MinusIcon.tsx';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    // FIX: Add producers prop to look up producer names.
    producers: Producer[];
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemoveFromCart: (productId: string) => void;
    onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, producers, onUpdateQuantity, onRemoveFromCart, onCheckout }) => {
    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    return (
        <div className={`fixed inset-0 overflow-hidden z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Carrito de compra</h2>
                                    <div className="ml-3 h-7 flex items-center">
                                        <button type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500" onClick={onClose}>
                                            <span className="sr-only">Cerrar panel</span>
                                            <XIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    {items.length === 0 ? (
                                        <p className="text-center text-gray-500">Tu carrito está vacío.</p>
                                    ) : (
                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                            {items.map(({ product, quantity }) => {
                                                const producerName = producers.find(p => p.id === product.producerId)?.name || 'Productor Desconocido';
                                                return (
                                                    <li key={product.id} className="flex py-6">
                                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover object-center" />
                                                        </div>
                                                        <div className="ml-4 flex flex-1 flex-col">
                                                            <div>
                                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                                    <h3><a href="#">{product.name}</a></h3>
                                                                    <p className="ml-4">€{(product.price * quantity).toFixed(2)}</p>
                                                                </div>
                                                                {/* FIX: Use looked-up producer name instead of non-existent property. */}
                                                                <p className="mt-1 text-sm text-gray-500">{producerName}</p>
                                                            </div>
                                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                                <div className="flex items-center border border-gray-200 rounded">
                                                                    <button onClick={() => onUpdateQuantity(product.id, quantity - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"><MinusIcon className="w-4 h-4" /></button>
                                                                    <p className="px-3 py-1 font-medium">{quantity}</p>
                                                                    <button onClick={() => onUpdateQuantity(product.id, quantity + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"><PlusIcon className="w-4 h-4" /></button>
                                                                </div>
                                                                <div className="flex">
                                                                    <button type="button" onClick={() => onRemoveFromCart(product.id)} className="font-medium text-a4coGreen hover:text-a4coBlack transition-colors">
                                                                        Quitar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {items.length > 0 && (
                                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p>€{subtotal.toFixed(2)}</p>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">Gastos de envío calculados en el checkout.</p>
                                    <div className="mt-6">
                                        <button
                                            onClick={onCheckout}
                                            className="w-full flex items-center justify-center rounded-md border border-transparent bg-a4coGreen px-6 py-3 text-base font-bold text-a4coBlack shadow-sm hover:bg-a4coBlack hover:text-white transition-colors">
                                            Finalizar compra
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CartSidebar;