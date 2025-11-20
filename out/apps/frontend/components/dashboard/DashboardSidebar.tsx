
import React from 'react';
import { DashboardIcon } from '../icons/DashboardIcon.tsx';
import { BoxIcon } from '../icons/BoxIcon.tsx';
import { ClipboardListIcon } from '../icons/ClipboardListIcon.tsx';
import { UserIcon } from '../icons/UserIcon.tsx';
import { LogoutIcon } from '../icons/LogoutIcon.tsx';
import { A4COLogo } from '../icons/A4COLogo.tsx';

type DashboardView = 'home' | 'products' | 'orders' | 'profile';

interface DashboardSidebarProps {
    currentView: DashboardView;
    onSelectView: (view: DashboardView) => void;
    onLogout: () => void;
    producerName: string;
}

const SidebarLink: React.FC<{
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive
                ? 'bg-a4coGreen text-a4coBlack'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
    </button>
);


const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ currentView, onSelectView, onLogout, producerName }) => {
    return (
        <aside className="fixed top-0 left-0 w-64 h-full bg-a4coBlack text-white flex flex-col">
            <div className="flex items-center justify-center h-20 border-b border-gray-800">
                 <A4COLogo className="h-10 text-white" />
                 <span className="ml-2 font-bold text-xl">A4CO</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <SidebarLink
                    icon={DashboardIcon}
                    label="Resumen"
                    isActive={currentView === 'home'}
                    onClick={() => onSelectView('home')}
                />
                <SidebarLink
                    icon={BoxIcon}
                    label="Productos"
                    isActive={currentView === 'products'}
                    onClick={() => onSelectView('products')}
                />
                <SidebarLink
                    icon={ClipboardListIcon}
                    label="Pedidos"
                    isActive={currentView === 'orders'}
                    onClick={() => onSelectView('orders')}
                />
                <SidebarLink
                    icon={UserIcon}
                    label="Perfil"
                    isActive={currentView === 'profile'}
                    onClick={() => onSelectView('profile')}
                />
            </nav>
            <div className="px-4 py-6 border-t border-gray-800">
                <div className="mb-4">
                    <p className="text-sm font-semibold">{producerName}</p>
                    <p className="text-xs text-gray-400">Productor</p>
                </div>
                 <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-red-800/50 hover:text-white transition-colors"
                >
                    <LogoutIcon className="w-5 h-5 mr-3" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
