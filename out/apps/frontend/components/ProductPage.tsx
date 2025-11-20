
import React, { useState } from 'react';
// FIX: Add file extensions to imports to resolve modules.
import type { Product, Producer, User } from '../types.ts';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon.tsx';
import { StarIcon } from './icons/StarIcon.tsx';
import { HeartIcon } from './icons/HeartIcon.tsx';
import { MinusIcon } from './icons/MinusIcon.tsx';
import { PlusIcon } from './icons/PlusIcon.tsx';
import ReviewForm from './ReviewForm.tsx';

interface ProductPageProps {
    product: Product;
    producer: Producer;
    onAddToCart: (productId: string, quantity: number) => void;
    onBack: () => void;
    onProducerSelect: (producerId: string) => void;
    currentUser: User | null;
    isFavorite: boolean;
    onToggleFavorite: (productId: string) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, producer, onAddToCart, onBack, onProducerSelect, currentUser, isFavorite, onToggleFavorite }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(product.imageUrl);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, Math.min(product.stock, prev + amount)));
    };

    const handleAddToCartClick = () => {
        onAddToCart(product.id, quantity);
    };
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(product.id);
    };

    const handleReviewSubmit = (rating: number, comment: string) => {
        // In a real app, this would submit the review to the backend.
        console.log({ rating, comment });
        alert("¡Gracias por tu reseña!");
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-a4coBlack mb-8">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Volver
                </button>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    {/* Image gallery */}
                    <div className="flex flex-col-reverse">
                        <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                            <div className="grid grid-cols-4 gap-6">
                                {[product.imageUrl, ...product.galleryImageUrls].map((image, idx) => (
                                    <button key={idx} className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none ${selectedImage === image ? 'ring-2 ring-offset-2 ring-a4coGreen' : ''}`} onClick={() => setSelectedImage(image)}>
                                        <span className="absolute inset-0 rounded-md overflow-hidden">
                                            <img src={image} alt="" className="w-full h-full object-center object-cover" />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full aspect-w-1 aspect-h-1">
                            <img src={selectedImage} alt={product.name} className="w-full h-full object-center object-cover sm:rounded-lg" />
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl text-gray-900">€{product.price.toFixed(2)}</p>
                        </div>

                        <div className="mt-3">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-a4coYellow' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <p className="ml-3 text-sm text-gray-500">{product.reviewCount} reseñas</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="text-base text-gray-700 space-y-4" dangerouslySetInnerHTML={{ __html: product.longDescription.replace(/\n/g, '<br />') }} />
                        </div>

                        <div className="mt-6">
                             <div 
                                onClick={() => onProducerSelect(producer.id)}
                                className="group inline-flex items-center cursor-pointer"
                            >
                                <img src={producer.logoUrl} alt={producer.name} className="h-10 w-10 rounded-full mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Vendido por</p>
                                    <p className="text-sm font-semibold text-gray-800 group-hover:text-a4coGreen">{producer.name}</p>
                                </div>
                            </div>
                        </div>

                        <form className="mt-6">
                            <div className="flex items-center">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button type="button" onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-gray-500 hover:bg-gray-100"><MinusIcon className="w-5 h-5" /></button>
                                    <span className="px-4 py-2 font-medium">{quantity}</span>
                                    <button type="button" onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-gray-500 hover:bg-gray-100"><PlusIcon className="w-5 h-5" /></button>
                                </div>
                                <p className="ml-4 text-sm text-gray-500">{product.stock} disponibles</p>
                            </div>
                            <div className="mt-10 flex">
                                <button type="button" onClick={handleAddToCartClick} className="max-w-xs flex-1 bg-a4coGreen border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-bold text-a4coBlack hover:bg-a4coBlack hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-a4coGreen sm:w-full">
                                    Añadir al carrito
                                </button>
                                <button type="button" onClick={handleFavoriteClick} className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-red-500">
                                    <HeartIcon className={`h-6 w-6 flex-shrink-0 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                    <span className="sr-only">Añadir a favoritos</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 pt-10 border-t">
                     <h2 className="text-2xl font-bold text-a4coBlack">Opiniones de Clientes</h2>
                     {product.reviews.length > 0 ? (
                         <div className="mt-6 space-y-8">
                             {product.reviews.map((review) => (
                                 <div key={review.id} className="flex space-x-4">
                                     <div className="flex-shrink-0">
                                         <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                             {review.author.charAt(0)}
                                         </div>
                                     </div>
                                     <div>
                                         <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`h-5 w-5 ${i < review.rating ? 'text-a4coYellow' : 'text-gray-300'}`} />
                                            ))}
                                         </div>
                                         <p className="mt-2 text-base text-gray-600">{review.comment}</p>
                                         <p className="mt-2 text-sm text-gray-500">{review.author} - {new Date(review.date).toLocaleDateString()}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     ) : (
                         <p className="mt-6 text-gray-500">Este producto aún no tiene reseñas. ¡Sé el primero!</p>
                     )}
                     
                     {currentUser && <ReviewForm onSubmit={handleReviewSubmit} />}
                </div>

            </div>
        </div>
    );
};

export default ProductPage;
