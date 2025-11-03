// FIX: Implement the AddEditProductModal component.
import React, { useState, useEffect } from 'react';
import type { Product, Category } from '../../types.ts';
import { XIcon } from '../icons/XIcon.tsx';

interface AddEditProductModalProps {
    product: Product | null;
    categories: Category[];
    onClose: () => void;
    onSave: (productData: Omit<Product, 'id' | 'producerId'> | Product) => Promise<void>;
}

// FIX: Add missing properties to emptyProduct to match the expected type for new products.
const emptyProduct: Omit<Product, 'id' | 'producerId'> = {
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    imageUrl: '',
    galleryImageUrls: [],
    categoryId: '',
    rating: 0,
    reviewCount: 0,
    stock: 0,
    reviews: [],
};

const AddEditProductModal: React.FC<AddEditProductModalProps> = ({ product, categories, onClose, onSave }) => {
    // FIX: Update state type to align with the corrected emptyProduct constant.
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'producerId'> | Product>(product || emptyProduct);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({ ...emptyProduct, categoryId: categories[0]?.id || '' });
        }
    }, [product, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    const isEditMode = product !== null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex justify-center items-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">{isEditMode ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción Corta</label>
                        <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700">Descripción Larga</label>
                        <textarea name="longDescription" id="longDescription" rows={4} value={formData.longDescription} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (€)</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                            <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" step="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm">
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL de la Imagen Principal</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm" />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-a4coGreen border border-transparent rounded-md text-sm font-bold text-a4coBlack hover:bg-a4coBlack hover:text-white disabled:bg-gray-400">
                            {isSaving ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditProductModal;
