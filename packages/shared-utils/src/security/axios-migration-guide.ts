/**
 * Guía de migración: De axios vulnerable a SecureAxiosClient
 *
 * Este archivo muestra cómo migrar código existente que usa axios
 * directamente a la versión segura con protección contra DoS.
 */

// ❌ CÓDIGO VULNERABLE (ANTES)
// import axios from 'axios';
//
// const api = axios.create({
//   baseURL: 'https://api.example.com',
//   timeout: 30000, // Sin límites de tamaño - VULNERABLE
// });
//
// export const getUser = async (id: string) => {
//   return api.get(`/users/${id}`);
// };
//
// export const createUser = async (userData: any) => {
//   return api.post('/users', userData); // Sin validación de tamaño - VULNERABLE
// };

// ✅ CÓDIGO SEGURO (DESPUÉS)
import { SecureAxiosFactory } from './axios-security';

const api = SecureAxiosFactory.createClient('https://api.example.com', {
  // Límites de tamaño para prevenir DoS
  maxContentLength: 5 * 1024 * 1024, // 5MB responses
  maxBodyLength: 2 * 1024 * 1024, // 2MB requests
  maxResponseSize: 20 * 1024 * 1024, // 20MB total response size

  // Timeouts agresivos
  timeout: 15000, // 15s total timeout
  connectTimeout: 5000, // 5s connect timeout

  // Circuit breaker para resiliencia
  circuitBreakerEnabled: true,
  failureThreshold: 3, // Abrir después de 3 fallos
  recoveryTimeout: 30000, // Intentar recuperación después de 30s
  monitoringWindow: 60000, // Ventana de 1 minuto

  // Rate limiting
  rateLimitEnabled: true,
  maxRequestsPerMinute: 60,

  // Retry logic
  retryEnabled: true,
  maxRetries: 2,
  retryDelay: 1000,

  // Memory monitoring
  memoryMonitoringEnabled: true,
  memoryThreshold: 80, // Alertar si heap > 80%
});

export const getUser = async (id: string) => {
  return api.get(`/users/${id}`);
};

export const createUser = async (userData: any) => {
  return api.post('/users', userData);
};

// ✅ EJEMPLO AVANZADO: Servicio con configuración específica
export class SecureUserService {
  private api: ReturnType<typeof SecureAxiosFactory.createClient>;

  constructor(baseURL: string) {
    this.api = SecureAxiosFactory.createClient(baseURL, {
      // Configuración más estricta para datos sensibles
      maxContentLength: 2 * 1024 * 1024, // 2MB para user data
      maxBodyLength: 1 * 1024 * 1024, // 1MB para requests
      timeout: 10000, // 10s timeout
      circuitBreakerEnabled: true,
      rateLimitEnabled: true,
      maxRequestsPerMinute: 30, // Más restrictivo para user operations
    });
  }

  async getUserProfile(userId: string) {
    try {
      const response = await this.api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, profileData: any) {
    try {
      const response = await this.api.put(`/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Método para monitoreo de seguridad
  getSecurityStats() {
    return this.api.getSecurityStats();
  }
}

// ✅ EJEMPLO: Configuración por entorno
export const createEnvironmentApiClient = (
  baseURL: string,
  environment: 'development' | 'production'
) => {
  const baseConfig = SecureAxiosFactory.createDefaultConfig();

  if (environment === 'production') {
    return SecureAxiosFactory.createClient(baseURL, {
      ...baseConfig,
      // Configuración más estricta en producción
      maxContentLength: 5 * 1024 * 1024,
      timeout: 15000,
      circuitBreakerEnabled: true,
      rateLimitEnabled: true,
      memoryMonitoringEnabled: true,
    });
  } else {
    return SecureAxiosFactory.createClient(baseURL, {
      ...baseConfig,
      // Configuración más permisiva en desarrollo
      maxContentLength: 50 * 1024 * 1024,
      timeout: 30000,
      circuitBreakerEnabled: false, // Desactivado para debugging
      rateLimitEnabled: false,
      memoryMonitoringEnabled: false,
    });
  }
};

// ✅ EJEMPLO: Migración de código existente paso a paso
export const migrationExamples = {
  // PASO 1: Reemplazar import
  step1: {
    before: "import axios from 'axios';\nconst api = axios.create({ baseURL: '...' });",
    after:
      "import { SecureAxiosFactory } from '@a4co/shared-utils/security/axios-security';\nconst api = SecureAxiosFactory.createClient('...');",
  },

  // PASO 2: Agregar configuración de seguridad
  step2: {
    before:
      "const api = axios.create({\n  baseURL: 'https://api.example.com',\n  timeout: 10000\n});",
    after:
      "const api = SecureAxiosFactory.createClient('https://api.example.com', {\n  maxContentLength: 10 * 1024 * 1024, // 10MB\n  maxBodyLength: 5 * 1024 * 1024,     // 5MB\n  timeout: 15000,                      // 15s\n  circuitBreakerEnabled: true,\n  rateLimitEnabled: true,\n  maxRequestsPerMinute: 60\n});",
  },

  // PASO 3: Actualizar llamadas (no cambian)
  step3: {
    before: "const response = await api.get('/users');",
    after:
      "// La interfaz es la misma - no cambia nada aquí\nconst response = await api.get('/users');",
  },

  // PASO 4: Agregar monitoreo (opcional)
  step4: {
    monitoring:
      "// Obtener estadísticas de seguridad\nconst stats = api.getSecurityStats();\nconsole.log('Circuit breaker state:', stats.circuitBreaker.state);\nconsole.log('Memory usage:', stats.memoryUsage);",
  },
};

// ✅ EJEMPLO: Script de validación
export const validateMigration = async () => {
  console.log('🔍 Validating axios security migration...');

  // Ejecutar script de validación
  try {
    const { AxiosSecurityValidator } = await import('./validate-axios-security');
    const validator = new AxiosSecurityValidator();
    const issues = validator.validate();

    if (issues.length === 0) {
      console.log('✅ All axios instances are secure!');
      return true;
    } else {
      console.log('❌ Security issues found:');
      issues.forEach(issue => {
        console.log(`  ${issue.severity}: ${issue.file}:${issue.line} - ${issue.issue}`);
      });
      return false;
    }
  } catch (error) {
    console.error('Error running validation:', error);
    return false;
  }
};

// ✅ EJEMPLO: Monitoreo en producción
export const setupProductionMonitoring = (
  apiClient: ReturnType<typeof SecureAxiosFactory.createClient>
) => {
  // Monitoreo periódico
  setInterval(() => {
    const stats = apiClient.getSecurityStats();

    // Alertas de circuit breaker
    if (stats.circuitBreaker.state === 'OPEN') {
      console.error('🚨 Circuit breaker is OPEN - service may be failing');
      // Aquí enviar alerta a sistema de monitoreo (ej: DataDog, New Relic)
    }

    // Alertas de memoria
    if (
      stats.memoryUsage.heapUsed >
      stats.config.memoryThreshold! * 0.01 * stats.memoryUsage.heapTotal
    ) {
      console.warn('⚠️ High memory usage detected');
    }

    // Logging de métricas
    console.log('API Security Metrics:', {
      circuitBreakerState: stats.circuitBreaker.state,
      memoryUsage: `${(stats.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      failures: stats.circuitBreaker.failures,
    });
  }, 30000); // Cada 30 segundos
};
