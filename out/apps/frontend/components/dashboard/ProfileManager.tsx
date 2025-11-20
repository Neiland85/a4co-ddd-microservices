// FIX: Implement the ProfileManager component.
import React, { useState, useEffect } from 'react';
import type { Producer } from '../../types.ts';
import * as api from '../../api.ts';
import { StoreIcon } from '../icons/StoreIcon.tsx';
import { CameraIcon } from '../icons/CameraIcon.tsx';
import { VideoCameraIcon } from '../icons/VideoCameraIcon.tsx';
import { PROVINCES } from '../../constants.ts';

interface ProfileManagerProps {
    producer: Producer;
    onProfileUpdate: () => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ producer, onProfileUpdate }) => {
    const [formData, setFormData] = useState<Producer>(producer);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        setFormData(producer);
    }, [producer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage('');
        try {
            await api.updateProducer(formData);
            setSaveMessage('¡Perfil actualizado con éxito!');
            onProfileUpdate();
        } catch (error) {
            console.error(error);
            setSaveMessage('Error al actualizar el perfil.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Gestionar Perfil del Productor</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium text-gray-900">Información General</h3>
                        <p className="mt-1 text-sm text-gray-600">Actualiza los datos principales de tu negocio.</p>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen" />
                        </div>
                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-gray-700">Provincia</label>
                            <select name="province" id="province" value={formData.province} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen">
                                {PROVINCES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea name="description" id="description" rows={5} value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-a4coGreen focus:ring-a4coGreen" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200"></div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium text-gray-900">Branding y Multimedia</h3>
                        <p className="mt-1 text-sm text-gray-600">Gestiona los recursos visuales de tu página de perfil.</p>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">URL del Logo</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500"><StoreIcon className="w-5 h-5"/></span>
                                <input type="text" name="logoUrl" id="logoUrl" value={formData.logoUrl} onChange={handleChange} required className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-a4coGreen focus:ring-a4coGreen" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700">URL del Banner</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500"><CameraIcon className="w-5 h-5"/></span>
                                <input type="text" name="bannerUrl" id="bannerUrl" value={formData.bannerUrl} onChange={handleChange} required className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-a4coGreen focus:ring-a4coGreen" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">URL del Vídeo (Opcional)</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500"><VideoCameraIcon className="w-5 h-5"/></span>
                                <input type="text" name="videoUrl" id="videoUrl" value={formData.videoUrl || ''} onChange={handleChange} className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-a4coGreen focus:ring-a4coGreen" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end items-center">
                        {saveMessage && <span className={`text-sm mr-4 ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{saveMessage}</span>}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 bg-a4coGreen border border-transparent rounded-md text-sm font-bold text-a4coBlack hover:bg-a4coBlack hover:text-white disabled:bg-gray-400"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfileManager;
