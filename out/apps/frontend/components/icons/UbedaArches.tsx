import React from 'react';

export const UbedaArches: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="archGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#27FF9F" />
                <stop offset="100%" stopColor="#EADDC6" />
            </linearGradient>
            <pattern id="arch-pattern" patternUnits="userSpaceOnUse" width="50" height="60">
                <g stroke="url(#archGradient)" strokeWidth="1.5" fill="none">
                    {/* Columns */}
                    <path d="M 2 60 V 35" />
                    <path d="M 48 60 V 35" />
                    {/* Arch */}
                    <path d="M 2 35 A 23 23 0 0 1 48 35" />
                </g>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arch-pattern)" />
    </svg>
);