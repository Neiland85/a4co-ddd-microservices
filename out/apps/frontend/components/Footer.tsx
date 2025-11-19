
import React from 'react';
import { A4COLogo } from './icons/A4COLogo.tsx';

interface FooterProps {
    onMissionClick: () => void;
    onProducerAuthClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onMissionClick, onProducerAuthClick }) => {
    return (
        <footer className="bg-a4coBlack text-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <A4COLogo className="h-12 w-auto" />
                        <p className="mt-4 text-sm text-gray-400">
                            Desde Jaén, con alma andaluza. Apoyando al pequeño comercio y al artesano de nuestra tierra.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold tracking-wider uppercase">Navegación</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-300 hover:text-a4coGreen text-sm">Inicio</a></li>
                            <li><button onClick={onMissionClick} className="text-gray-300 hover:text-a4coGreen text-sm text-left">Nuestra Misión</button></li>
                            <li><a href="#" className="text-gray-300 hover:text-a4coGreen text-sm">Categorías</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold tracking-wider uppercase">Soporte</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-300 hover:text-a4coGreen text-sm">Contacto</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-a4coGreen text-sm">Preguntas Frecuentes</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-a4coGreen text-sm">Envíos y Devoluciones</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold tracking-wider uppercase">Productores</h3>
                         <ul className="mt-4 space-y-2">
                            <li><button onClick={onProducerAuthClick} className="text-gray-300 hover:text-a4coGreen text-sm text-left">Acceso Productores</button></li>
                            <li><a href="#" className="text-gray-300 hover:text-a4coGreen text-sm">Vende en A4CO</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} A4CO. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
