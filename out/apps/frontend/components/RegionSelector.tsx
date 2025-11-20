import React, { useState, useRef, useEffect } from 'react';
// FIX: Add file extensions to imports to fix module resolution errors.
import { REGIONS } from '../constants.ts';
import type { Region } from '../types.ts';
import { MapPinIcon } from './icons/MapPinIcon.tsx';
import { ChevronDownIcon } from './icons/ChevronDownIcon.tsx';

interface RegionSelectorProps {
    selectedRegion: Region;
    onRegionChange: (region: Region) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onRegionChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (region: Region) => {
        onRegionChange(region);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-a4coBlack/40 backdrop-blur-sm border border-gray-700 rounded-full hover:border-a4coGreen transition-colors duration-200"
            >
                <MapPinIcon className="w-5 h-5 text-a4coGreen" />
                <span className="font-medium text-sm text-white">{selectedRegion.name}</span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-anthracite/90 backdrop-blur-md rounded-lg shadow-xl z-10 border border-gray-700 overflow-hidden">
                    <ul className="py-1">
                        {REGIONS.map((region) => (
                            <li key={region.id}>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleSelect(region); }}
                                    className={`block px-4 py-2 text-sm ${selectedRegion.id === region.id ? 'font-bold text-a4coGreen bg-a4coBlack/60' : 'text-white hover:bg-a4coBlack/60'}`}
                                >
                                    {region.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RegionSelector;