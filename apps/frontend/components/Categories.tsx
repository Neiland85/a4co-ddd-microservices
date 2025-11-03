

import React from 'react';
import CategoryCard from './CategoryCard.tsx';
import CategoryCardSkeleton from './CategoryCardSkeleton.tsx';
// FIX: Add file extension to types import to resolve module.
import type { Category } from '../types.ts';

interface CategoriesProps {
    categories: Category[];
    // FIX: Update prop type to allow null for clearing selection.
    onSelectCategory: (categoryId: string | null) => void;
    isLoading: boolean;
}

const Categories: React.FC<CategoriesProps> = ({ categories, onSelectCategory, isLoading }) => {
    return (
        <section className="bg-gray-50 py-16 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-a4coBlack">Explora por Categoría</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Encuentra tesoros artesanales, desde el oro líquido de nuestros olivos hasta la cerámica que cuenta historias.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, index) => <CategoryCardSkeleton key={index} />)
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            <CategoryCard key={category.id} category={category} onSelect={onSelectCategory} />
                        ))
                    ) : (
                         <div className="col-span-2 md:col-span-4 text-center py-12">
                            <p className="text-gray-500">No hay categorías disponibles en este momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Categories;