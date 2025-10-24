import React, { useState, useEffect } from 'react';
import { UbedaArches } from './icons/UbedaArches.tsx';

interface HeroProps {
    onNavigate: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="relative h-[60vh] min-h-[400px] sm:h-[70vh] flex items-center justify-center text-center text-white">
            <div className="absolute inset-0 bg-a4coBlack overflow-hidden">
                <div
                    className={`
                        absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2/3
                        animate-rise-and-glow 
                        transition-all duration-500 ease-in-out
                        ${scrolled ? 'opacity-0 scale-95' : 'opacity-20'}
                    `}
                >
                    <UbedaArches />
                </div>
            </div>
            <div className="relative z-10 p-6">
                <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg leading-tight">
                    DESDE JAÉN <br />
                    <span className="text-a4coGreen">CON ALMA ANDALUZA</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 drop-shadow">
                    Descubre la autenticidad de los productos artesanos de nuestra tierra.
                </p>
                <div className="mt-8">
                    <button
                        onClick={onNavigate}
                        className="px-8 py-4 bg-a4coGreen text-a4coBlack font-bold rounded-full text-lg hover:bg-white transform hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                        Explorar Productos
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes rise-and-glow {
                    0% {
                        opacity: 0;
                        transform: translateY(40px);
                        filter: drop-shadow(0 0 15px rgba(39, 255, 159, 0.7));
                    }
                    70% {
                        filter: drop-shadow(0 0 15px rgba(39, 255, 159, 0));
                    }
                    100% {
                        opacity: 0.2;
                        transform: translateY(0);
                        filter: none;
                    }
                }
                .animate-rise-and-glow {
                    animation: rise-and-glow 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
            `}</style>
        </section>
    );
};

export default Hero;