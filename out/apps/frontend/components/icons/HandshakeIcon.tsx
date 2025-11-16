import React from 'react';

export const HandshakeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17a2 2 0 002-2v-2a2 2 0 00-2-2H7l-4 4 4 4h4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a2 2 0 00-2 2v2a2 2 0 002 2h4l4-4-4-4h-4z" />
    </svg>
);