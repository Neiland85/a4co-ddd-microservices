import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children }) => {
  return (
    <button className={`px-4 py-2 rounded ${variant === 'outline' ? 'border' : 'bg-blue-500 text-white'}`}>
      {children}
    </button>
  );
};

Button.displayName = 'Button';
