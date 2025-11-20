"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnvironmentSpecificClient = exports.migrateExistingAxiosUsage = exports.setupAxiosMonitoring = exports.SecureChatService = exports.createExternalServiceClient = exports.createCriticalApiClient = exports.createBasicSecureClient = void 0;
const axios_security_1 = require("./axios-security");
const createBasicSecureClient = (baseURL) => {
    return axios_security_1.SecureAxiosFactory.createClient(baseURL);
};
exports.createBasicSecureClient = createBasicSecureClient;
const createCriticalApiClient = (baseURL) => {
    return axios_security_1.SecureAxiosFactory.createClient(baseURL, {
        maxContentLength: 5 * 1024 * 1024,
        maxBodyLength: 2 * 1024 * 1024,
        maxResponseSize: 20 * 1024 * 1024,
        timeout: 15000,
        connectTimeout: 5000,
        failureThreshold: 3,
        recoveryTimeout: 30000,
        rateLimitEnabled: true,
        maxRequestsPerMinute: 30,
        maxRetries: 2,
        retryDelay: 500,
    });
};
exports.createCriticalApiClient = createCriticalApiClient;
const createExternalServiceClient = (baseURL) => {
    return axios_security_1.SecureAxiosFactory.createClient(baseURL, {
        maxContentLength: 20 * 1024 * 1024,
        maxResponseSize: 100 * 1024 * 1024,
        timeout: 60000,
        connectTimeout: 15000,
        failureThreshold: 10,
        recoveryTimeout: 120000,
        rateLimitEnabled: false,
    });
};
exports.createExternalServiceClient = createExternalServiceClient;
class SecureChatService {
    constructor(baseURL) {
        this.client = (0, exports.createBasicSecureClient)(baseURL);
    }
    async sendMessage(message, userId) {
        try {
            const response = await this.client.post('/chat/messages', {
                message,
                userId,
                timestamp: new Date().toISOString(),
            });
            return response.data;
        }
        catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
    async getMessages(chatId) {
        try {
            const response = await this.client.get(`/chat/${chatId}/messages`);
            return response.data;
        }
        catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    }
    getSecurityStats() {
        return this.client.getSecurityStats();
    }
}
exports.SecureChatService = SecureChatService;
const setupAxiosMonitoring = (client) => {
    setInterval(() => {
        const stats = client.getSecurityStats();
        console.log('Axios Security Stats:', stats);
        if (stats.circuitBreaker.state === 'OPEN') {
            console.warn('[!] Circuit breaker is OPEN - service may be down');
        }
    }, 30000);
};
exports.setupAxiosMonitoring = setupAxiosMonitoring;
const migrateExistingAxiosUsage = () => {
};
exports.migrateExistingAxiosUsage = migrateExistingAxiosUsage;
const createEnvironmentSpecificClient = (baseURL, isProduction) => {
    const baseConfig = axios_security_1.SecureAxiosFactory.createDefaultConfig();
    if (isProduction) {
        return axios_security_1.SecureAxiosFactory.createClient(baseURL, {
            ...baseConfig,
            maxContentLength: 5 * 1024 * 1024,
            timeout: 20000,
            circuitBreakerEnabled: true,
            rateLimitEnabled: true,
            memoryMonitoringEnabled: true,
        });
    }
    else {
        return axios_security_1.SecureAxiosFactory.createClient(baseURL, {
            ...baseConfig,
            maxContentLength: 50 * 1024 * 1024,
            timeout: 60000,
            circuitBreakerEnabled: false,
            rateLimitEnabled: false,
            memoryMonitoringEnabled: false,
        });
    }
};
exports.createEnvironmentSpecificClient = createEnvironmentSpecificClient;
//# sourceMappingURL=axios-security-examples.js.map