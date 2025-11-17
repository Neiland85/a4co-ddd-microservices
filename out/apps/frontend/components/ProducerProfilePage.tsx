
import React from 'react';
import type { Product, Producer, User } from '../types.ts';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon.tsx';
import Catalogue from './Catalogue.tsx';

interface ProducerProfilePageProps {
    producer: Producer;
    products: Product[];
    producers: Producer[]; // Pass all producers to the Catalogue
    onBack: () => void;
    onProductSelect: (product: Product) => void;
    onProducerSelect: (producerId: string) => void;
    currentUser: User | null;
    onToggleFavorite: (productId: string) => void;
}

const ProducerProfilePage: React.FC<ProducerProfilePageProps> = ({
    producer,
    products,
    producers,
    onBack,
    onProductSelect,
    onProducerSelect,
    currentUser,
    onToggleFavorite
}) => {
    return (
        <div className="bg-white">
            <div className="relative h-64 sm:h-80 bg-gray-200">
                <img
                    src={producer.bannerUrl}
                    alt={`${producer.name} banner`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <div className="container mx-auto flex items-end gap-6">
                         <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg flex-shrink-0">
                            <img src={producer.logoUrl} alt={`${producer.name} logo`} className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{producer.name}</h1>
                            <p className="mt-1 text-lg text-gray-200 drop-shadow">{producer.province}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-a4coBlack mb-8">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Volver
                </button>
                
                <div className="max-w-4xl">
                    <h2 className="text-2xl font-bold text-a4coBlack">Sobre Nosotros</h2>
                    <p className="mt-4 text-gray-700 whitespace-pre-line">{producer.description}</p>
                </div>
                
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-a4coBlack text-center mb-8">Nuestros Productos</h2>
                    <Catalogue
                        products={products}
                        producers={producers}
                        isLoading={false}
                        onProductSelect={onProductSelect}
                        onProducerSelect={onProducerSelect}
                        currentUser={currentUser}
                        onToggleFavorite={onToggleFavorite}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProducerProfilePage;