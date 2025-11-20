import React from 'react';

const CategoryCardSkeleton: React.FC = () => {
    return (
        <div className="group relative flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 animate-pulse">
            <div className="w-20 h-20 mb-4 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
    );
};

export default CategoryCardSkeleton;