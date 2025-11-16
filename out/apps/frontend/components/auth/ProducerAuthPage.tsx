import React, { useState } from 'react';
import { A4COLogo } from '../icons/A4COLogo.tsx';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon.tsx';
// FIX: Add imports for api and User type to handle login logic internally.
import * as api from '../../api.ts';
import type { User } from '../../types.ts';


// FIX: Update props to accept onLoginSuccess instead of onLogin to match App.tsx.
interface ProducerAuthPageProps {
    onBack: () => void;
    onLoginSuccess: (user: User, token: string) => void;
}

const ProducerAuthPage: React.FC<ProducerAuthPageProps> = ({ onBack, onLoginSuccess }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // FIX: Call the login API directly and use the onLoginSuccess callback.
        const result = api.loginUser(email, password, 'producer');
        if (result) {
            onLoginSuccess(result.user, result.token);
        } else {
            setError('Email o contraseña incorrectos.');
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would call a registration API
        alert("Función de registro no implementada en esta demo.");
    };

    const renderLoginForm = () => (
        <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
                <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="email-login"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                    type="password"
                    id="password-login"
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
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-a4coBlack bg-a4coGreen hover:bg-a4coBlack hover:text-white transition-colors"
                >
                    Acceder
                </button>
            </div>
        </form>
    );

    const renderRegisterForm = () => (
        <form onSubmit={handleRegisterSubmit} className="space-y-6">
             <div>
                <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
                <input type="text" id="business-name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
                <label htmlFor="email-register" className="block text-sm font-medium text-gray-700">Email de Contacto</label>
                <input type="email" id="email-register" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
                <label htmlFor="password-register" className="block text-sm font-medium text-gray-700">Crear Contraseña</label>
                <input type="password" id="password-register" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-a4coBlack bg-a4coGreen hover:bg-a4coBlack hover:text-white transition-colors"
                >
                    Crear cuenta de productor
                </button>
            </div>
        </form>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <button onClick={onBack} className="absolute top-8 left-8 flex items-center text-sm font-medium text-gray-600 hover:text-a4coBlack">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Volver a la tienda
            </button>
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                 <A4COLogo className="h-12 w-auto mx-auto text-a4coBlack" />
                 <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Portal de Productores</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <div className="mb-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`w-1/2 py-4 text-sm font-medium text-center border-b-2 ${activeTab === 'login' ? 'border-a4coGreen text-a4coGreen' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Acceder
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`w-1/2 py-4 text-sm font-medium text-center border-b-2 ${activeTab === 'register' ? 'border-a4coGreen text-a4coGreen' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>
                    {activeTab === 'login' ? renderLoginForm() : renderRegisterForm()}
                </div>
            </div>
        </div>
    );
};

export default ProducerAuthPage;
