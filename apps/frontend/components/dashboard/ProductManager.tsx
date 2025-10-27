// FIX: Implement the ProductManager component for the producer dashboard.
import React, { useState } from 'react';
import type { Product, Category } from '../../types.ts';
// FIX: Add file extension to api.ts import.
import * as api from '../../api.ts';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { PencilIcon } from '../icons/PencilIcon.tsx';
import { TrashIcon } from '../icons/TrashIcon.tsx';
import AddEditProductModal from './AddEditProductModal.tsx';

interface ProductManagerProps {
    products: Product[];
    categories: Category[];
    producerId: string;
    onProductsUpdate: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, categories, producerId, onProductsUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleOpenModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async (productData: Omit<Product, 'id' | 'producerId'> | Product) => {
        try {
            if ('id' in productData) {
                // Editing existing product
                await api.updateProduct(productData);
            } else {
                // Adding new product
                await api.addProduct({ ...productData, producerId });
            }
            onProductsUpdate(); // Refresh the product list
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save product:", error);
            // Here you would show an error message to the user
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            try {
                await api.deleteProduct(productId);
                onProductsUpdate(); // Refresh the product list
            } catch (error) {
                console.error("Failed to delete product:", error);
                // Here you would show an error message to the user
            }
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Gestionar Productos</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-a4coGreen text-a4coBlack font-bold text-sm rounded-lg hover:bg-a4coBlack hover:text-white transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Añadir Producto
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {categories.find(c => c.id === product.categoryId)?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                      {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <PencilIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                                         <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-500">No tienes ningún producto añadido todavía.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AddEditProductModal
                    product={editingProduct}
                    categories={categories}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                />
            )}
        </div>
    );
};

export default ProductManager;