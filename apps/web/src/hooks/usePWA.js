"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePWA = void 0;
const react_1 = require("react");
const usePWA = () => {
    const [state, setState] = (0, react_1.useState)({
        isInstalled: false,
        isInstallable: false,
        isOnline: navigator.onLine,
        isOffline: !navigator.onLine,
        hasServiceWorker: 'serviceWorker' in navigator,
        hasPushSupport: 'PushManager' in window,
        hasGeolocation: 'geolocation' in navigator,
        installPrompt: null,
    });
    const [deferredPrompt, setDeferredPrompt] = (0, react_1.useState)(null);
    // Detectar si la app está instalada
    (0, react_1.useEffect)(() => {
        const checkIfInstalled = () => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setState(prev => ({ ...prev, isInstalled: true }));
            }
        };
        checkIfInstalled();
        window.addEventListener('appinstalled', checkIfInstalled);
        return () => {
            window.removeEventListener('appinstalled', checkIfInstalled);
        };
    }, []);
    // Detectar cambios en la conexión
    (0, react_1.useEffect)(() => {
        const handleOnline = () => {
            setState(prev => ({ ...prev, isOnline: true, isOffline: false }));
        };
        const handleOffline = () => {
            setState(prev => ({ ...prev, isOnline: false, isOffline: true }));
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    // Capturar el prompt de instalación
    (0, react_1.useEffect)(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setState(prev => ({ ...prev, isInstallable: true, installPrompt: e }));
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);
    // Registrar el service worker
    (0, react_1.useEffect)(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(registration => {
                console.log('Service Worker registrado:', registration);
                // Verificar actualizaciones
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Nueva versión disponible
                                console.log('Nueva versión disponible');
                            }
                        });
                    }
                });
            })
                .catch(error => {
                console.error('Error registrando Service Worker:', error);
            });
        }
    }, []);
    // Función para instalar la PWA
    const installPWA = (0, react_1.useCallback)(async (options) => {
        if (!deferredPrompt) {
            throw new Error('No hay prompt de instalación disponible');
        }
        try {
            // Mostrar el prompt de instalación
            deferredPrompt.prompt();
            // Esperar la respuesta del usuario
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('Usuario aceptó instalar la PWA');
                setState(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
                setDeferredPrompt(null);
            }
            else {
                console.log('Usuario rechazó instalar la PWA');
            }
        }
        catch (error) {
            console.error('Error durante la instalación:', error);
            throw error;
        }
    }, [deferredPrompt]);
    // Función para solicitar permisos de notificación push
    const requestNotificationPermission = (0, react_1.useCallback)(async () => {
        if (!('Notification' in window)) {
            throw new Error('Este navegador no soporta notificaciones');
        }
        if (Notification.permission === 'granted') {
            return true;
        }
        if (Notification.permission === 'denied') {
            throw new Error('Permisos de notificación denegados');
        }
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }, []);
    // Función para enviar notificación push
    const sendPushNotification = (0, react_1.useCallback)(async (title, options) => {
        if (!('Notification' in window)) {
            throw new Error('Este navegador no soporta notificaciones');
        }
        if (Notification.permission !== 'granted') {
            throw new Error('Permisos de notificación no concedidos');
        }
        const notification = new Notification(title, {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            ...options,
        });
        return notification;
    }, []);
    // Función para obtener ubicación del usuario
    const getCurrentLocation = (0, react_1.useCallback)(async (options) => {
        if (!('geolocation' in navigator)) {
            throw new Error('Este navegador no soporta geolocalización');
        }
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
                ...options,
            });
        });
    }, []);
    // Función para calcular distancia entre dos puntos
    const calculateDistance = (0, react_1.useCallback)((lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radio de la Tierra en km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);
    // Función para sincronizar en background
    const syncInBackground = (0, react_1.useCallback)(async (tag) => {
        if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
            throw new Error('Service Worker no disponible');
        }
        try {
            await navigator.serviceWorker.ready;
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration && 'sync' in registration) {
                await registration.sync.register(tag);
                console.log('Sincronización en background registrada:', tag);
            }
        }
        catch (error) {
            console.error('Error registrando sincronización:', error);
            throw error;
        }
    }, []);
    // Función para verificar actualizaciones del service worker
    const checkForUpdates = (0, react_1.useCallback)(async () => {
        if (!('serviceWorker' in navigator)) {
            return false;
        }
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                await registration.update();
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error verificando actualizaciones:', error);
            return false;
        }
    }, []);
    // Función para limpiar caches
    const clearCaches = (0, react_1.useCallback)(async () => {
        if (!('caches' in window)) {
            return false;
        }
        try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('Caches limpiados exitosamente');
            return true;
        }
        catch (error) {
            console.error('Error limpiando caches:', error);
            return false;
        }
    }, []);
    return {
        ...state,
        installPWA,
        requestNotificationPermission,
        sendPushNotification,
        getCurrentLocation,
        calculateDistance,
        syncInBackground,
        checkForUpdates,
        clearCaches,
    };
};
exports.usePWA = usePWA;
//# sourceMappingURL=usePWA.js.map