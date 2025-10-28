import React from 'react';
// FIX: Add file extensions to imports to resolve modules.
import type { Region, User } from '../types.ts';
import RegionSelector from './RegionSelector.tsx';
import { SearchIcon } from './icons/SearchIcon.tsx';
import { UserIcon } from './icons/UserIcon.tsx';
import { CartIcon } from './icons/CartIcon.tsx';
import { A4COLogo } from './icons/A4COLogo.tsx';

interface HeaderProps {
    selectedRegion: Region;
    onRegionChange: (region: Region) => void;
    onSearch: (query: string) => void;
    cartItemCount: number;
    onCartClick: () => void;
    currentUser: User | null;
    onLoginClick: () => void;
    onUserDashboardClick: () => void;
    onLogoutClick?: () => void;
    // FIX: Add onProducerZoneClick to props to handle navigation.
    onProducerZoneClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
    selectedRegion,
    onRegionChange,
    onSearch,
    cartItemCount,
    onCartClick,
    currentUser,
    onLoginClick,
    onUserDashboardClick,
    onLogoutClick,
    onProducerZoneClick,
}) => {
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    return (
        <header className="sticky top-0 z-40 bg-a4coBlack/60 backdrop-blur-lg border-b border-gray-800 text-white">
            <div className="container mx-auto px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="flex items-center space-x-2">
                           <A4COLogo className="h-10 w-auto" />
                        </a>
                    </div>

                    {/* Middle Section: Region & Search */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <RegionSelector selectedRegion={selectedRegion} onRegionChange={onRegionChange} />
                         <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar aceites, cerámica..."
                                className="w-64 bg-a4coBlack/40 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-a4coGreen transition-colors"
                                onChange={(e) => onSearch(e.target.value)}
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Right Section: Auth & Cart */}
                    <div className="flex items-center space-x-4">
                        <button onClick={onProducerZoneClick} className="hidden sm:block px-4 py-2 border border-transparent rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors">
                            Zona Productores
                        </button>
                        {currentUser ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-a4coBlack/40 backdrop-blur-sm border border-gray-700 rounded-full hover:border-a4coGreen transition-colors duration-200"
                                >
                                    <UserIcon className="w-5 h-5 text-a4coGreen" />
                                    <span className="font-medium text-sm text-white hidden sm:block">{currentUser.name.split(' ')[0]}</span>
                                </button>
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <button
                                            onClick={() => { onUserDashboardClick(); setShowUserMenu(false); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Mi cuenta
                                        </button>
                                        {onLogoutClick && (
                                            <button
                                                onClick={() => { onLogoutClick(); setShowUserMenu(false); }}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Cerrar sesión
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                             <button onClick={onLoginClick} className="flex items-center space-x-2 px-4 py-2 bg-a4coBlack/40 backdrop-blur-sm border border-gray-700 rounded-full hover:border-a4coGreen transition-colors duration-200">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-sm text-white">Acceder</span>
                            </button>
                        )}
                       
                        <button onClick={onCartClick} className="relative p-2 bg-a4coBlack/40 border border-gray-700 rounded-full hover:border-a4coGreen transition-colors">
                            <CartIcon className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-a4coGreen text-xs font-bold text-a4coBlack">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
