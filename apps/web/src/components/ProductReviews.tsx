'use client';

import React from 'react';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ProductReviews({ reviews, averageRating, totalReviews }: ProductReviewsProps) {
  const [showAllReviews, setShowAllReviews] = React.useState(false);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const ratingDistribution = React.useMemo(() => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });
    return distribution.reverse(); // 5 stars first
  }, [reviews]);

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="mt-2 flex items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="mt-1 text-sm text-gray-600">{totalReviews} reseñas</div>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars, index) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="w-8 text-sm text-gray-600">{stars}★</span>
                <div className="h-2 flex-1 rounded bg-gray-200">
                  <div
                    className="h-2 rounded bg-yellow-400"
                    style={{
                      width: `${totalReviews > 0 ? (ratingDistribution[index] / totalReviews) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right text-sm text-gray-600">
                  {ratingDistribution[index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Reseñas de clientes ({totalReviews})
        </h3>

        <div className="space-y-6">
          {displayedReviews.map(review => (
            <div key={review.id} className="rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                      <span className="text-sm font-medium text-gray-700">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{review.userName}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-700">{review.comment}</p>

                  <div className="mt-4 flex items-center gap-4">
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Útil ({review.helpful})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 3 && (
          <div className="text-center">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              {showAllReviews ? 'Mostrar menos reseñas' : `Ver todas las reseñas (${totalReviews})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
