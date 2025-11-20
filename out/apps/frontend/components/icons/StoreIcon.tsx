
// FIX: Implement the missing StoreIcon component.
import React from 'react';

export const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H6.75A2.25 2.25 0 004.5 13.5V21M4.5 10.5v10.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V10.5m-15 0a2.25 2.25 0 012.25-2.25h10.5a2.25 2.25 0 012.25 2.25m-15 0V3.75a2.25 2.25 0 012.25-2.25h10.5a2.25 2.25 0 012.25 2.25v6.75m-1.5-6.75h-9" />
    </svg>
);
