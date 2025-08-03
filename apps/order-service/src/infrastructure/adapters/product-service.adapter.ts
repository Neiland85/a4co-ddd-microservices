import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CircuitBreakerFactory, WithCircuitBreaker } from '@a4co/shared-utils/src/infrastructure/resilience/circuit-breaker';
import { firstValueFrom } from 'rxjs';

export interface ProductValidationRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface ProductValidationResponse {
  valid: boolean;
  items: Array<{
    productId: string;
    productName: string;
    available: boolean;
    currentPrice: number;
    stock: number;
    requestedQuantity: number;
    artisanId: string;
  }>;
  errors?: string[];
}

export interface ProductAvailability {
  productId: string;
  available: boolean;
  stock: number;
  price: number;
  artisanId: string;
}

/**
 * Adaptador para comunicación síncrona con Product Service
 * Implementa Circuit Breaker para resiliencia
 */
@Injectable()
export class ProductServiceAdapter {
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
    
    // Configurar circuit breaker específico para este servicio
    CircuitBreakerFactory.create('product-service', {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 5000,
      resetTimeout: 30000,
      onStateChange: (oldState, newState) => {
        console.log(`Product Service Circuit Breaker: ${oldState} -> ${newState}`);
      },
    });
  }

  /**
   * Valida disponibilidad y precios de productos
   * Llamada síncrona crítica para el proceso de orden
   */
  @WithCircuitBreaker('product-service', {
    fallbackFunction: async () => ({
      valid: false,
      items: [],
      errors: ['Product service is temporarily unavailable'],
    }),
  })
  async validateProducts(request: ProductValidationRequest): Promise<ProductValidationResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<ProductValidationResponse>(
          `${this.baseUrl}/api/products/validate-items`,
          request,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Service': 'order-service',
            },
            timeout: 4000,
          }
        )
      );

      return response.data;
    } catch (error) {
      console.error('Error validating products:', error);
      throw new Error('Failed to validate products');
    }
  }

  /**
   * Obtiene disponibilidad de un producto específico
   * Implementa cache local para reducir latencia
   */
  @WithCircuitBreaker('product-service')
  async getProductAvailability(productId: string): Promise<ProductAvailability> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ProductAvailability>(
          `${this.baseUrl}/api/products/${productId}/availability`,
          {
            headers: {
              'X-Service': 'order-service',
            },
            timeout: 3000,
          }
        )
      );

      return response.data;
    } catch (error) {
      console.error(`Error getting availability for product ${productId}:`, error);
      throw new Error(`Failed to get product availability`);
    }
  }

  /**
   * Obtiene información de múltiples productos
   * Usa paralelización para mejorar performance
   */
  async getMultipleProductsAvailability(productIds: string[]): Promise<ProductAvailability[]> {
    // Dividir en lotes para evitar sobrecarga
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < productIds.length; i += batchSize) {
      batches.push(productIds.slice(i, i + batchSize));
    }

    const results: ProductAvailability[] = [];
    
    for (const batch of batches) {
      const batchResults = await Promise.allSettled(
        batch.map(id => this.getProductAvailability(id))
      );

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`Failed to get availability for product ${batch[index]}`);
          // Agregar producto con disponibilidad desconocida
          results.push({
            productId: batch[index],
            available: false,
            stock: 0,
            price: 0,
            artisanId: '',
          });
        }
      });
    }

    return results;
  }

  /**
   * Verifica el estado del servicio
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/health`, {
          timeout: 2000,
        })
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }
}