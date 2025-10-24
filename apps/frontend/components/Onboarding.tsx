import React from 'react';

interface OnboardingProps {
    onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    return (
        <div className="fixed inset-0 bg-a4coBlack/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-auto p-8 text-center flex flex-col items-center transform transition-all duration-300 animate-fade-in-scale">
                
                <h1 className="text-6xl font-black text-a4coYellow mb-6">A4CO</h1>
                
                <h2 className="text-2xl font-bold text-a4coBlack mb-2">
                    A4CO nació en Jaén para dar voz al pequeño comercio.
                </h2>
                <p className="text-gray-600 mb-8">
                    Descubre productos auténticos y apoya a los negocios locales de Andalucía.
                </p>
                
                <button
                    onClick={onComplete}
                    className="w-full px-8 py-3 bg-a4coGreen text-a4coBlack font-bold rounded-full text-lg hover:bg-a4coBlack hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    Empezar a Descubrir
                </button>
            </div>
             <style>{`
                @keyframes fade-in-scale {
                    0% {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Onboarding;