
// FIX: Implement the Catalogue component.
import React from 'react';
import type { Product, Producer, User } from '../types.ts';
import ProductCard from './ProductCard.tsx';
import ProductCardSkeleton from './ProductCardSkeleton.tsx';
import BusinessCard from './BusinessCard.tsx'; // Assuming we might want to promote a business

interface CatalogueProps {
    products: Product[];
    producers: Producer[];
    isLoading: boolean;
    onProductSelect: (product: Product) => void;
    onProducerSelect: (producerId: string) => void;
    currentUser: User | null;
    onToggleFavorite: (productId: string) => void;
}

const Catalogue: React.FC<CatalogueProps> = ({ products, producers, isLoading, onProductSelect, onProducerSelect, currentUser, onToggleFavorite }) => {
    const businessAd = {
        id: 'ad-1',
        name: 'Conviértete en Productor de A4CO',
        description: '¿Eres un artesano o productor andaluz? Únete a nuestra plataforma y lleva tus productos a toda la comunidad.',
        cta: {
            text: 'Más Información',
            url: '#',
        }
    };

    return (
        <section id="catalogue" className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold text-a4coBlack">Nuestro Catálogo</h2>
                     <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Productos seleccionados con mimo, directamente desde el corazón de Andalucía.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
                    ) : products.length > 0 ? (
                        <>
                            {products.map((product, index) => (
                                <React.Fragment key={product.id}>
                                    <ProductCard
                                        product={product}
                                        producers={producers}
                                        onSelect={onProductSelect}
                                        onProducerSelect={onProducerSelect}
                                        isFavorite={currentUser?.favoriteProductIds.includes(product.id) ?? false}
                                        onToggleFavorite={onToggleFavorite}
                                    />
                                     {/* Insert an ad card after the 4th product */}
                                    {index === 3 && <BusinessCard business={businessAd} />}
                                </React.Fragment>
                            ))}
                        </>
                    ) : (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-12">
                            <p className="text-gray-500 text-lg">No se han encontrado productos que coincidan con tu búsqueda.</p>
                            <p className="text-gray-400 mt-2">Prueba a cambiar la región o la categoría seleccionada.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Catalogue;
