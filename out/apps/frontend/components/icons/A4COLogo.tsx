
import React from 'react';

export const A4COLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 200 50" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <style>
            {`.heavy { font: bold 45px sans-serif; fill: currentColor; }`}
        </style>
        <text x="0" y="40" className="heavy">A4CO</text>
    </svg>
);
