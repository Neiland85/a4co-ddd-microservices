
import React, { useState } from 'react';
// FIX: Add file extension to icon import to resolve module.
import { StarIcon } from './icons/StarIcon.tsx';

interface ReviewFormProps {
    onSubmit: (rating: number, comment: string) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0) {
            onSubmit(rating, comment);
            setRating(0);
            setComment('');
        } else {
            alert("Por favor, selecciona una valoración.")
        }
    };

    return (
        <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-900">Escribe una reseña</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tu valoración</label>
                    <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className={`h-6 w-6 cursor-pointer ${
                                    (hoverRating || rating) >= star ? 'text-a4coYellow' : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Tu reseña</label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-a4coGreen text-a4coBlack font-bold rounded-full hover:bg-a4coBlack hover:text-white transition-colors"
                >
                    Enviar reseña
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
