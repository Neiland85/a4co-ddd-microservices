import React from 'react';
import { CommunityIcon } from './icons/CommunityIcon.tsx';
import { HandshakeIcon } from './icons/HandshakeIcon.tsx';
import { DigitalIcon } from './icons/DigitalIcon.tsx';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon.tsx';

interface MissionPageProps {
    onBack: () => void;
}

const MissionPage: React.FC<MissionPageProps> = ({ onBack }) => {
    const impactFeatures = [
        {
            icon: CommunityIcon,
            title: 'Fijando Población',
            description: 'Cada compra apoya a negocios en zonas rurales, ayudando a las familias a prosperar en su tierra y combatiendo la despoblación en la Andalucía interior.',
        },
        {
            icon: HandshakeIcon,
            title: 'Creando Empleo Digno',
            description: 'Fomentamos un ecosistema de comercio justo que genera empleo estable y reconoce el valor del trabajo artesano y agrícola de nuestras provincias.',
        },
        {
            icon: DigitalIcon,
            title: 'Impulso Digital',
            description: 'Ofrecemos a los pequeños productores una plataforma digital de primer nivel, dándoles visibilidad y acceso a un mercado más amplio sin perder su esencia.',
        },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-a4coBlack h-64 flex items-center justify-center text-white">
                <img src="https://picsum.photos/id/1015/1920/800" alt="Campo de olivos en Andalucía" className="absolute inset-0 w-full h-full object-cover opacity-20"/>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-bold sm:text-5xl drop-shadow-md text-a4coGreen">
                        Nuestra misión desde Andalucía
                    </h1>
                    <p className="mt-4 text-xl text-gray-300 drop-shadow">Impulsar el alma de nuestra tierra, un producto a la vez.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                 <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-a4coBlack mb-12">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Volver al inicio
                </button>

                {/* Infographics Section */}
                <div className="grid md:grid-cols-3 gap-12">
                    {impactFeatures.map((feature) => (
                        <div key={feature.title} className="text-center">
                            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-a4coYellow mx-auto mb-6 border-4 border-white shadow-md">
                                <feature.icon className="h-12 w-12 text-a4coBlack" />
                            </div>
                            <h3 className="text-2xl font-bold text-a4coBlack">{feature.title}</h3>
                            <p className="mt-4 text-base text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Manifesto Section */}
                <div className="mt-24 bg-gray-50 rounded-lg p-12 relative overflow-hidden">
                    <div className="text-center">
                         <h2 className="text-3xl font-bold text-a4coBlack">El Manifiesto A4CO</h2>
                         <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
                            Creemos en el poder de lo auténtico. En un mundo de producción en masa, defendemos el valor de lo hecho a mano, con paciencia y sabiduría. Cada producto en nuestra plataforma cuenta una historia: la de una familia, una tradición, un paisaje. <span className="font-bold text-a4coGreen bg-a4coBlack px-2 py-1 rounded">A4CO</span> es más que un mercado; es una celebración de nuestra identidad.
                         </p>
                         <button onClick={onBack} className="mt-8 px-8 py-3 bg-a4coGreen text-a4coBlack font-bold rounded-full text-lg hover:bg-a4coBlack hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                            Explora los productos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionPage;