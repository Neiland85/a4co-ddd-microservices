import React from 'react';
// FIX: Add file extensions to imports to fix module resolution errors.
import type { Province } from '../types.ts';
import { InfoIcon } from './icons/InfoIcon.tsx';
import { XIcon } from './icons/XIcon.tsx';

interface GeolocationBannerProps {
    province: Province;
    onConfirm: () => void;
    onDismiss: () => void;
}

const GeolocationBanner: React.FC<GeolocationBannerProps> = ({ province, onConfirm, onDismiss }) => {
    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-a4coBlack border border-gray-700 rounded-lg shadow-lg z-50 animate-fade-in-down">
            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center">
                    <InfoIcon className="w-6 h-6 text-a4coGreen mr-3 flex-shrink-0" />
                    <p className="text-sm text-white">
                        Parece que estás en <span className="font-bold text-a4coYellow">{province.name}</span>. Te mostramos productos de esta zona.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-1.5 bg-a4coGreen text-a4coBlack font-semibold rounded-full text-sm hover:bg-white transition-colors"
                    >
                        De acuerdo
                    </button>
                    <button
                        onClick={onDismiss}
                        className="text-gray-400 hover:text-white"
                        aria-label="Cerrar y ver todas las provincias"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default GeolocationBanner;