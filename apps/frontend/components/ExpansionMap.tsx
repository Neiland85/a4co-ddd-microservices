import React from 'react';
// FIX: Add file extensions to imports to fix module resolution errors.
import SpainMap from './icons/SpainMap.tsx';

const ExpansionMap: React.FC = () => {
    return (
        <section className="py-16 sm:py-24 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-a4coBlack mb-4">Nuestra Expansión</h2>
                <p className="max-w-3xl mx-auto text-gray-600 mb-12">
                    Estamos trabajando para llevar los mejores productos de Andalucía a todos los rincones. Pronto estaremos en más provincias.
                </p>
                <div className="max-w-4xl mx-auto">
                    <SpainMap className="w-full h-auto" />
                </div>
            </div>
        </section>
    );
};

export default ExpansionMap;