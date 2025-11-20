"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupProductionMonitoring = exports.validateMigration = exports.migrationExamples = exports.createEnvironmentApiClient = exports.SecureUserService = exports.createUser = exports.getUser = void 0;
const axios_security_1 = require("./axios-security");
const api = axios_security_1.SecureAxiosFactory.createClient('https://api.example.com', {
    maxContentLength: 5 * 1024 * 1024,
    maxBodyLength: 2 * 1024 * 1024,
    maxResponseSize: 20 * 1024 * 1024,
    timeout: 15000,
    connectTimeout: 5000,
    circuitBreakerEnabled: true,
    failureThreshold: 3,
    recoveryTimeout: 30000,
    monitoringWindow: 60000,
    rateLimitEnabled: true,
    maxRequestsPerMinute: 60,
    retryEnabled: true,
    maxRetries: 2,
    retryDelay: 1000,
    memoryMonitoringEnabled: true,
    memoryThreshold: 80,
});
const getUser = async (id) => {
    return api.get(`/users/${id}`);
};
exports.getUser = getUser;
const createUser = async (userData) => {
    return api.post('/users', userData);
};
exports.createUser = createUser;
class SecureUserService {
    constructor(baseURL) {
        this.api = axios_security_1.SecureAxiosFactory.createClient(baseURL, {
            maxContentLength: 2 * 1024 * 1024,
            maxBodyLength: 1 * 1024 * 1024,
            timeout: 10000,
            circuitBreakerEnabled: true,
            rateLimitEnabled: true,
            maxRequestsPerMinute: 30,
        });
    }
    async getUserProfile(userId) {
        try {
            const response = await this.api.get(`/users/${userId}/profile`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }
    async updateUserProfile(userId, profileData) {
        try {
            const response = await this.api.put(`/users/${userId}/profile`, profileData);
            return response.data;
        }
        catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }
    getSecurityStats() {
        return this.api.getSecurityStats();
    }
}
exports.SecureUserService = SecureUserService;
const createEnvironmentApiClient = (baseURL, environment) => {
    const baseConfig = axios_security_1.SecureAxiosFactory.createDefaultConfig();
    if (environment === 'production') {
        return axios_security_1.SecureAxiosFactory.createClient(baseURL, {
            ...baseConfig,
            maxContentLength: 5 * 1024 * 1024,
            timeout: 15000,
            circuitBreakerEnabled: true,
            rateLimitEnabled: true,
            memoryMonitoringEnabled: true,
        });
    }
    else {
        return axios_security_1.SecureAxiosFactory.createClient(baseURL, {
            ...baseConfig,
            maxContentLength: 50 * 1024 * 1024,
            timeout: 30000,
            circuitBreakerEnabled: false,
            rateLimitEnabled: false,
            memoryMonitoringEnabled: false,
        });
    }
};
exports.createEnvironmentApiClient = createEnvironmentApiClient;
exports.migrationExamples = {
    step1: {
        before: "import axios from 'axios';\nconst api = axios.create({ baseURL: '...' });",
        after: "import { SecureAxiosFactory } from '@a4co/shared-utils/security/axios-security';\nconst api = SecureAxiosFactory.createClient('...');",
    },
    step2: {
        before: "const api = axios.create({\n  baseURL: 'https://api.example.com',\n  timeout: 10000\n});",
        after: "const api = SecureAxiosFactory.createClient('https://api.example.com', {\n  maxContentLength: 10 * 1024 * 1024, // 10MB\n  maxBodyLength: 5 * 1024 * 1024,     // 5MB\n  timeout: 15000,                      // 15s\n  circuitBreakerEnabled: true,\n  rateLimitEnabled: true,\n  maxRequestsPerMinute: 60\n});",
    },
    step3: {
        before: "const response = await api.get('/users');",
        after: "// La interfaz es la misma - no cambia nada aquí\nconst response = await api.get('/users');",
    },
    step4: {
        monitoring: "// Obtener estadísticas de seguridad\nconst stats = api.getSecurityStats();\nconsole.log('Circuit breaker state:', stats.circuitBreaker.state);\nconsole.log('Memory usage:', stats.memoryUsage);",
    },
};
const validateMigration = async () => {
    console.log('🔍 Validating axios security migration...');
    try {
        const { AxiosSecurityValidator } = await import('./validate-axios-security');
        const validator = new AxiosSecurityValidator();
        const issues = validator.validate();
        if (issues.length === 0) {
            console.log('✅ All axios instances are secure!');
            return true;
        }
        else {
            console.log('❌ Security issues found:');
            issues.forEach(issue => {
                console.log(`  ${issue.severity}: ${issue.file}:${issue.line} - ${issue.issue}`);
            });
            return false;
        }
    }
    catch (error) {
        console.error('Error running validation:', error);
        return false;
    }
};
exports.validateMigration = validateMigration;
const setupProductionMonitoring = (apiClient) => {
    setInterval(() => {
        const stats = apiClient.getSecurityStats();
        if (stats.circuitBreaker.state === 'OPEN') {
            console.error('[!] Circuit breaker is OPEN - service may be failing');
        }
        if (stats.memoryUsage.heapUsed >
            stats.config.memoryThreshold * 0.01 * stats.memoryUsage.heapTotal) {
            console.warn('⚠️ High memory usage detected');
        }
        console.log('API Security Metrics:', {
            circuitBreakerState: stats.circuitBreaker.state,
            memoryUsage: `${(stats.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
            failures: stats.circuitBreaker.failures,
        });
    }, 30000);
};
exports.setupProductionMonitoring = setupProductionMonitoring;
//# sourceMappingURL=axios-migration-guide.js.map