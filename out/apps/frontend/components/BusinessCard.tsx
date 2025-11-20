import React from 'react';
// FIX: Add file extension to types import to resolve module.
import type { Business } from '../types.ts';

// FIX: Define props interface for the component.
interface BusinessCardProps {
    business: Business;
}

// FIX: Implement the BusinessCard component which was previously missing.
const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
    return (
        <div className="group relative col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
                {/* Placeholder for a real logo */}
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                     <span className="text-xl font-bold text-a4coBlack">{business.name.substring(0, 3)}</span>
                </div>
            </div>
            <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-a4coBlack">{business.name}</h3>
                <p className="mt-2 text-gray-600">{business.description}</p>
                 <a 
                    href={business.cta.url}
                    className="mt-4 inline-block text-a4coGreen font-semibold hover:underline"
                 >
                    {business.cta.text} &rarr;
                </a>
            </div>
        </div>
    );
};

export default BusinessCard;