// FIX: Add file extension to types import to resolve module.
import type { Region, Province } from './types.ts';

export const REGIONS: Region[] = [
    { id: 'all', name: 'Toda Andalucía' },
    { id: 'jaen', name: 'Jaén' },
    { id: 'cordoba', name: 'Córdoba' },
    { id: 'sevilla', name: 'Sevilla' },
    { id: 'huelva', name: 'Huelva' },
    { id: 'cadiz', name: 'Cádiz' },
    { id: 'malaga', name: 'Málaga' },
    { id: 'granada', name: 'Granada' },
    { id: 'almeria', name: 'Almería' },
];

export const PROVINCES: Province[] = [
    { id: 'jaen', name: 'Jaén' },
    { id: 'cordoba', name: 'Córdoba' },
    { id: 'sevilla', name: 'Sevilla' },
    { id: 'huelva', name: 'Huelva' },
    { id: 'cadiz', name: 'Cádiz' },
    { id: 'malaga', name: 'Málaga' },
    { id: 'granada', name: 'Granada' },
    { id: 'almeria', name: 'Almería' },
];