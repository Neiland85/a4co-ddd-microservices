import React, { useState } from 'react';
import { XIcon } from '../icons/XIcon.tsx';
import { A4COLogo } from '../icons/A4COLogo.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess?: () => void;
    onSwitchToProducerAuth: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess, onSwitchToProducerAuth }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(email, password, 'customer');

            if (success) {
                onLoginSuccess?.();
                onClose();
            } else {
                setError('Email o contraseña incorrectos.');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-a4coBlack/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-8">
                    <div className="text-center mb-6">
                        <A4COLogo className="h-10 w-auto mx-auto text-a4coBlack" />
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">Accede a tu cuenta</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm"
                            />
                        </div>
                        
                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-a4coBlack bg-a4coGreen hover:bg-a4coBlack hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Accediendo...' : 'Acceder'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                         <button onClick={onSwitchToProducerAuth} className="text-sm text-a4coGreen hover:underline font-medium">
                            ¿Eres productor? Accede aquí
                        </button>
                    </div>
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LoginModal;
