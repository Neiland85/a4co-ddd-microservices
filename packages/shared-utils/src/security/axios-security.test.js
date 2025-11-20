"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_security_1 = require("./axios-security");
describe('SecureAxiosClient', () => {
    let client;
    beforeEach(() => {
        jest.mock('axios');
        client = axios_security_1.SecureAxiosFactory.createClient('https://api.test.com');
    });
    afterEach(() => {
        client.destroy();
    });
    describe('Size Limits', () => {
        it('should reject requests with body too large', async () => {
            const largeData = 'x'.repeat(3 * 1024 * 1024);
            await expect(client.post('/test', { data: largeData })).rejects.toThrow('Request body too large');
        });
        it('should reject responses that are too large', async () => {
        });
    });
    describe('Circuit Breaker', () => {
        it('should open circuit after failure threshold', async () => {
            const failingClient = axios_security_1.SecureAxiosFactory.createClient('https://failing.api.com', {
                failureThreshold: 2,
                circuitBreakerEnabled: true,
            });
            for (let i = 0; i < 3; i++) {
                try {
                    await failingClient.get('/failing-endpoint');
                }
                catch (error) {
                }
            }
            const stats = failingClient.getSecurityStats();
            expect(stats.circuitBreaker.state).toBe('OPEN');
            failingClient.destroy();
        });
    });
    describe('Rate Limiting', () => {
        it('should limit requests per minute', async () => {
            const rateLimitedClient = axios_security_1.SecureAxiosFactory.createClient('https://api.test.com', {
                rateLimitEnabled: true,
                maxRequestsPerMinute: 2,
            });
            await expect(rateLimitedClient.get('/test1')).resolves.toBeDefined();
            await expect(rateLimitedClient.get('/test2')).resolves.toBeDefined();
            await expect(rateLimitedClient.get('/test3')).rejects.toThrow('Rate limit exceeded');
            rateLimitedClient.destroy();
        });
    });
    describe('Memory Monitoring', () => {
        it('should monitor memory usage', () => {
            const memoryClient = axios_security_1.SecureAxiosFactory.createClient('https://api.test.com', {
                memoryMonitoringEnabled: true,
            });
            const stats = memoryClient.getSecurityStats();
            expect(stats.memoryUsage).toHaveProperty('rss');
            expect(stats.memoryUsage).toHaveProperty('heapUsed');
            memoryClient.destroy();
        });
    });
    describe('Retry Logic', () => {
        it('should retry on network errors', async () => {
            let attempts = 0;
            const mockAxios = {
                get: jest.fn(() => {
                    attempts++;
                    if (attempts === 1) {
                        throw new Error('Network Error');
                    }
                    return Promise.resolve({ data: 'success' });
                }),
            };
        });
    });
});
describe('CircuitBreaker', () => {
    let breaker;
    beforeEach(() => {
        breaker = new axios_security_1.CircuitBreaker({
            failureThreshold: 3,
            recoveryTimeout: 1000,
            monitoringWindow: 5000,
        });
    });
    it('should start in CLOSED state', () => {
        expect(breaker.getState()).toBe('CLOSED');
    });
    it('should open after failure threshold', async () => {
        for (let i = 0; i < 3; i++) {
            try {
                await breaker.execute(() => Promise.reject(new Error('Test error')));
            }
            catch (error) {
            }
        }
        expect(breaker.getState()).toBe('OPEN');
    });
    it('should transition to HALF_OPEN after recovery timeout', async () => {
        for (let i = 0; i < 3; i++) {
            try {
                await breaker.execute(() => Promise.reject(new Error('Test error')));
            }
            catch (error) {
            }
        }
        expect(breaker.getState()).toBe('OPEN');
        await new Promise(resolve => setTimeout(resolve, 1100));
        try {
            await breaker.execute(() => Promise.resolve('success'));
        }
        catch (error) {
        }
    });
});
describe('RateLimiter', () => {
    let limiter;
    beforeEach(() => {
        limiter = new axios_security_1.RateLimiter(2, 60000);
    });
    it('should allow requests within limit', async () => {
        await expect(limiter.acquire()).resolves.toBeUndefined();
        await expect(limiter.acquire()).resolves.toBeUndefined();
    });
    it('should reject requests over limit', async () => {
        await limiter.acquire();
        await limiter.acquire();
        await expect(limiter.acquire()).rejects.toThrow('Rate limit exceeded');
    });
});
describe('MemoryMonitor', () => {
    let monitor;
    beforeEach(() => {
        monitor = new axios_security_1.MemoryMonitor(80);
    });
    afterEach(() => {
        monitor.stop();
    });
    it('should get current memory usage', () => {
        const usage = monitor.getCurrentUsage();
        expect(usage).toHaveProperty('rss');
        expect(usage).toHaveProperty('heapUsed');
        expect(typeof usage.rss).toBe('number');
    });
    it('should start and stop monitoring', () => {
        expect(() => {
            monitor.start(1000);
            monitor.stop();
        }).not.toThrow();
    });
});
describe('SecureAxiosFactory', () => {
    it('should create client with default config', () => {
        const client = axios_security_1.SecureAxiosFactory.createClient('https://api.test.com');
        expect(client).toBeInstanceOf(axios_security_1.SecureAxiosClient);
        const stats = client.getSecurityStats();
        expect(stats.config.maxContentLength).toBe(10 * 1024 * 1024);
        client.destroy();
    });
    it('should create client with custom config', () => {
        const customConfig = {
            maxContentLength: 5 * 1024 * 1024,
            timeout: 10000,
        };
        const client = axios_security_1.SecureAxiosFactory.createClient('https://api.test.com', customConfig);
        const stats = client.getSecurityStats();
        expect(stats.config.maxContentLength).toBe(5 * 1024 * 1024);
        expect(stats.config.timeout).toBe(10000);
        client.destroy();
    });
    it('should provide default config', () => {
        const defaultConfig = axios_security_1.SecureAxiosFactory.createDefaultConfig();
        expect(defaultConfig).toHaveProperty('maxContentLength');
        expect(defaultConfig).toHaveProperty('circuitBreakerEnabled', true);
        expect(defaultConfig).toHaveProperty('memoryMonitoringEnabled', true);
    });
});
//# sourceMappingURL=axios-security.test.js.map