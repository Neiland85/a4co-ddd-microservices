

import React from 'react';
// FIX: Add file extensions to imports to resolve modules.
import type { Category } from '../types.ts';
import { OliveOilIcon } from './icons/OliveOilIcon.tsx';
import { BreadIcon } from './icons/BreadIcon.tsx';
import { PotteryIcon } from './icons/PotteryIcon.tsx';
import { CosmeticsIcon } from './icons/CosmeticsIcon.tsx';
import { GiftsIcon } from './icons/GiftsIcon.tsx';
import { CraftsIcon } from './icons/CraftsIcon.tsx';

interface CategoryCardProps {
    category: Category;
    onSelect: (categoryId: string) => void;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    aceites: OliveOilIcon,
    panaderia: BreadIcon,
    ceramica: PotteryIcon,
    cosmetica: CosmeticsIcon,
    regalos: GiftsIcon,
    otros: CraftsIcon,
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
    const IconComponent = iconMap[category.id] || CraftsIcon;

    return (
        <div 
            onClick={() => onSelect(category.id)}
            className="group relative flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:border-a4coGreen hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
        >
            <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-a4coYellow/20 mb-4 transition-colors duration-300 group-hover:bg-a4coGreen/20">
                <IconComponent className="h-10 w-10 text-a4coBlack" />
            </div>
            <h3 className="text-lg font-semibold text-a4coBlack text-center">{category.name}</h3>
        </div>
    );
};

export default CategoryCard;