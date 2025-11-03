/**
 * Ejemplo de uso del cliente HTTP seguro con mitigaciones contra DoS
 *
 * Este archivo demuestra cómo usar SecureAxiosClient para proteger
 * contra vulnerabilidades de DoS en axios.
 */

import { SecureAxiosClient, SecureAxiosFactory } from './axios-security';

// Ejemplo 1: Cliente básico con configuración por defecto
export const createBasicSecureClient = (baseURL: string) => {
  return SecureAxiosFactory.createClient(baseURL);
};

// Ejemplo 2: Cliente con configuración personalizada para API crítica
export const createCriticalApiClient = (baseURL: string) => {
  return SecureAxiosFactory.createClient(baseURL, {
    // Límites más estrictos para APIs críticas
    maxContentLength: 5 * 1024 * 1024, // 5MB
    maxBodyLength: 2 * 1024 * 1024, // 2MB
    maxResponseSize: 20 * 1024 * 1024, // 20MB

    // Timeouts más agresivos
    timeout: 15000, // 15s
    connectTimeout: 5000, // 5s

    // Circuit breaker más sensible
    failureThreshold: 3,
    recoveryTimeout: 30000, // 30s

    // Rate limiting activado
    rateLimitEnabled: true,
    maxRequestsPerMinute: 30,

    // Retry más agresivo
    maxRetries: 2,
    retryDelay: 500,
  });
};

// Ejemplo 3: Cliente para servicios externos con alta tolerancia
export const createExternalServiceClient = (baseURL: string) => {
  return SecureAxiosFactory.createClient(baseURL, {
    // Límites más permisivos para servicios externos
    maxContentLength: 20 * 1024 * 1024, // 20MB
    maxResponseSize: 100 * 1024 * 1024, // 100MB

    // Timeouts más largos
    timeout: 60000, // 60s
    connectTimeout: 15000, // 15s

    // Circuit breaker más tolerante
    failureThreshold: 10,
    recoveryTimeout: 120000, // 2min

    // Sin rate limiting para servicios externos
    rateLimitEnabled: false,
  });
};

// Ejemplo 4: Uso en un servicio de chat
export class SecureChatService {
  private client: SecureAxiosClient;

  constructor(baseURL: string) {
    this.client = createBasicSecureClient(baseURL);
  }

  async sendMessage(message: string, userId: string) {
    try {
      const response = await this.client.post('/chat/messages', {
        message,
        userId,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(chatId: string) {
    try {
      const response = await this.client.get(`/chat/${chatId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Obtener estadísticas de seguridad
  getSecurityStats() {
    return this.client.getSecurityStats();
  }
}

// Ejemplo 5: Monitoreo y alertas
export const setupAxiosMonitoring = (client: SecureAxiosClient) => {
  // Monitoreo periódico de estadísticas
  setInterval(() => {
    const stats = client.getSecurityStats();
    console.log('Axios Security Stats:', stats);

    // Alertas basadas en estado del circuit breaker
    if (stats.circuitBreaker.state === 'OPEN') {
      console.warn('[!] Circuit breaker is OPEN - service may be down');
      // Aquí podrías enviar alertas a un sistema de monitoreo
    }
  }, 30000); // Cada 30 segundos
};

// Ejemplo 6: Configuración para migrar código existente
export const migrateExistingAxiosUsage = () => {
  // Código anterior (vulnerable):
  // import axios from 'axios';
  // const api = axios.create({ baseURL: 'https://api.example.com' });
  // Código nuevo (seguro):
  // import { SecureAxiosFactory } from '@a4co/shared-utils/security/axios-security';
  // const api = SecureAxiosFactory.createClient('https://api.example.com');
  // El cliente seguro tiene la misma interfaz que axios normal
  // pero con todas las protecciones contra DoS activadas
};

// Ejemplo 7: Configuración de producción vs desarrollo
export const createEnvironmentSpecificClient = (baseURL: string, isProduction: boolean) => {
  const baseConfig = SecureAxiosFactory.createDefaultConfig();

  if (isProduction) {
    return SecureAxiosFactory.createClient(baseURL, {
      ...baseConfig,
      // Configuración más estricta en producción
      maxContentLength: 5 * 1024 * 1024,
      timeout: 20000,
      circuitBreakerEnabled: true,
      rateLimitEnabled: true,
      memoryMonitoringEnabled: true,
    });
  } else {
    return SecureAxiosFactory.createClient(baseURL, {
      ...baseConfig,
      // Configuración más permisiva en desarrollo
      maxContentLength: 50 * 1024 * 1024,
      timeout: 60000,
      circuitBreakerEnabled: false, // Desactivado para debugging
      rateLimitEnabled: false,
      memoryMonitoringEnabled: false,
    });
  }
};
