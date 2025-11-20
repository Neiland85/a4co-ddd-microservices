

import React from 'react';
// FIX: Add file extensions to imports to fix module resolution errors.
import type { Product, Producer } from '../types.ts';
import { StarIcon } from './icons/StarIcon.tsx';
import { HeartIcon } from './icons/HeartIcon.tsx';

interface ProductCardProps {
    product: Product;
    producers: Producer[];
    onSelect: (product: Product) => void;
    onProducerSelect: (producerId: string) => void;
    isFavorite: boolean;
    onToggleFavorite: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, producers, onSelect, onProducerSelect, isFavorite, onToggleFavorite }) => {
    const producer = producers.find(p => p.id === product.producerId);

    const handleProducerClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (producer) {
            onProducerSelect(producer.id);
        }
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(product.id);
    };
    
    return (
        <div onClick={() => onSelect(product)} className="group cursor-pointer flex flex-col h-full">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                 <button 
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-all duration-200"
                    aria-label="Añadir a favoritos"
                >
                    <HeartIcon className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
            </div>
            <div className="mt-4 flex flex-col flex-grow">
                <h3 className="text-sm text-gray-700">{product.name}</h3>
                <p 
                    onClick={handleProducerClick}
                    className="mt-1 text-xs text-gray-500 hover:text-a4coGreen hover:underline"
                >
                    {producer ? producer.name : 'Productor Desconocido'}
                </p>
                <div className="flex items-center mt-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon
                                key={i}
                                className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-a4coYellow' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <p className="ml-2 text-xs text-gray-500">{product.reviewCount} reseñas</p>
                </div>
                <p className="mt-2 text-base font-medium text-gray-900 flex-grow-0">€{product.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductCard;