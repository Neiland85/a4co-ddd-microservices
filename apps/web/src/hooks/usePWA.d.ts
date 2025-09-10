interface PWAInstallPrompt {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
    }>;
}
interface PWAInstallOptions {
    title?: string;
    description?: string;
    icon?: string;
}
export declare const usePWA: () => {
    installPWA: (options?: PWAInstallOptions) => Promise<void>;
    requestNotificationPermission: () => Promise<boolean>;
    sendPushNotification: (title: string, options?: NotificationOptions) => Promise<Notification>;
    getCurrentLocation: (options?: PositionOptions) => Promise<GeolocationPosition>;
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
    syncInBackground: (tag: string) => Promise<void>;
    checkForUpdates: () => Promise<boolean>;
    clearCaches: () => Promise<boolean>;
    isInstalled: boolean;
    isInstallable: boolean;
    isOnline: boolean;
    isOffline: boolean;
    hasServiceWorker: boolean;
    hasPushSupport: boolean;
    hasGeolocation: boolean;
    installPrompt: PWAInstallPrompt | null;
};
export {};
//# sourceMappingURL=usePWA.d.ts.map