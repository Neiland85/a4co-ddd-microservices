import React from 'react';
import { BellIcon } from './icons/BellIcon.tsx';

const NotificationBell: React.FC = () => {
    return (
        <button className="relative text-gray-600 hover:text-olive-dark focus:outline-none">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-terracotta ring-2 ring-white"></span>
        </button>
    );
};

export default NotificationBell;