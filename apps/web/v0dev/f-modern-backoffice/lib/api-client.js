"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
// Cliente para consumir las APIs del backoffice
class ApiClient {
    baseUrl;
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;
    }
    async get(endpoint) {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    async post(endpoint, data) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    // Métodos específicos para el backoffice
    async getMetrics() {
        return this.get('/metrics');
    }
    async getEvents() {
        return this.get('/events');
    }
    async getNotifications() {
        return this.get('/notifications');
    }
    async createEvent(event) {
        return this.post('/events', event);
    }
}
exports.apiClient = new ApiClient();
//# sourceMappingURL=api-client.js.map