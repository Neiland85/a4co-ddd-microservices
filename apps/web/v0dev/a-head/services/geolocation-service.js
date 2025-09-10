"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geolocationService = void 0;
class GeolocationService {
    async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }
            navigator.geolocation.getCurrentPosition(position => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            }, error => {
                reject(new Error(`Geolocation error: ${error.message}`));
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            });
        });
    }
    async watchPosition(onPositionChange, onError) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }
            const watchId = navigator.geolocation.watchPosition(position => {
                onPositionChange({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            }, error => {
                const errorObj = new Error(`Geolocation error: ${error.message}`);
                if (onError) {
                    onError(errorObj);
                }
                else {
                    reject(errorObj);
                }
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000, // 1 minute
            });
            resolve(watchId);
        });
    }
    clearWatch(watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
    calculateDistance(pos1, pos2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(pos2.lat - pos1.lat);
        const dLng = this.toRadians(pos2.lng - pos1.lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(pos1.lat)) *
                Math.cos(this.toRadians(pos2.lat)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}
exports.geolocationService = new GeolocationService();
//# sourceMappingURL=geolocation-service.js.map