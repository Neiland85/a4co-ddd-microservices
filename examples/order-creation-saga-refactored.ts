/**
 * Ejemplo Refactorizado: Order Creation Saga - Sin Dependencias Directas
 * 
 * Este ejemplo muestra cómo implementar el patrón Saga sin violar
 * los principios de bounded contexts de DDD.
 */

import { 
  EventDrivenService, 
  EventHandler, 
  IEventBus 
} from '../packages/shared-utils/src/events/event-bus';
import { EventSubjects } from '../packages/shared-utils/src/events/subjects';
import { 
  OrderCreatedEvent,
  OrderConfirmedEvent,
  OrderCancelledEvent,
  StockReservedEvent,
  StockReleasedEvent,
  PaymentSucceededEvent,
  PaymentFailedEvent
} from '../packages/shared-utils/src/events/domain-events';
import {
  ProductInformationRequestedEvent,
  ProductInformationProvidedEvent,
  StockValidationRequestedEvent,
  StockValidationResponseEvent,
  UserInformationRequestedEvent,
  UserInformationProvidedEvent
} from '../packages/shared-utils/src/events/integration-events';
import { OrderCreationSagaOrchestrator } from '../packages/shared-utils/src/saga/saga-orchestrator';

// ========================================
// ORDER SERVICE - Solo maneja su propio dominio
// ========================================

export class OrderService extends EventDrivenService {
  private sagaOrchestrator: OrderCreationSagaOrchestrator;

  constructor(eventBus: IEventBus) {
    super('order-service');
    this.sagaOrchestrator = new OrderCreationSagaOrchestrator(eventBus);
  }

  /**
   * Crear una nueva orden - Solo maneja datos del contexto Order
   */
  async createOrder(orderData: {
    customerId: string;
    customerEmail: string;
    items: Array<{
      productId: string;  // Solo referencia, no datos completos
      quantity: number;
    }>;
    deliveryAddress: any;
  }): Promise<string> {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Crear evento de orden creada (solo datos del contexto Order)
    const orderCreatedEvent = new OrderCreatedEvent(orderId, {
      customerId: orderData.customerId,
      customerEmail: orderData.customerEmail,
      items: orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: 0, // Se llenará con datos de productos
        totalPrice: 0  // Se calculará después
      })),
      totalAmount: 0, // Se calculará después
      currency: 'EUR',
      deliveryAddress: orderData.deliveryAddress,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    });

    // Publicar evento de dominio
    await this.publishEvent(EventSubjects.ORDER_CREATED, orderCreatedEvent);
    
    // Iniciar saga para coordinar con otros servicios
    await this.sagaOrchestrator.startSaga(orderId, orderData);
    
    console.log(`✅ Orden ${orderId} creada, iniciando saga de validación...`);
    return orderId;
  }

  /**
   * Handler: Cuando se recibe información de productos
   */
  @EventHandler(EventSubjects.PRODUCT_INFORMATION_PROVIDED)
  async onProductInformationProvided(event: ProductInformationProvidedEvent): Promise<void> {
    const orderId = event.eventData.orderId;
    console.log(`📦 Información de productos recibida para orden ${orderId}`);
    
    // Actualizar la orden con información de productos
    // Esta lógica pertenece al contexto Order
    await this.sagaOrchestrator.handleSagaStep(orderId, 'PRODUCT_INFO_RECEIVED', event.eventData);
  }

  /**
   * Handler: Cuando se valida el stock
   */
  @EventHandler(EventSubjects.STOCK_VALIDATION_RESPONSE)
  async onStockValidationResponse(event: StockValidationResponseEvent): Promise<void> {
    const orderId = event.eventData.orderId;
    console.log(`📦 Validación de stock completada para orden ${orderId}`);
    
    await this.sagaOrchestrator.handleSagaStep(orderId, 'STOCK_VALIDATED', event.eventData);
  }

  /**
   * Handler: Cuando se recibe información del usuario
   */
  @EventHandler(EventSubjects.USER_INFORMATION_PROVIDED)
  async onUserInformationProvided(event: UserInformationProvidedEvent): Promise<void> {
    const orderId = event.eventData.orderId;
    console.log(`👤 Información de usuario recibida para orden ${orderId}`);
    
    await this.sagaOrchestrator.handleSagaStep(orderId, 'USER_INFO_RECEIVED', event.eventData);
  }

  /**
   * Handler: Cuando el pago es exitoso
   */
  @EventHandler(EventSubjects.PAYMENT_SUCCEEDED)
  async onPaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    const orderId = event.eventData.orderId;
    console.log(`💳 Pago exitoso para orden ${orderId}, confirmando orden...`);
    
    await this.sagaOrchestrator.handleSagaStep(orderId, 'PAYMENT_PROCESSED', {
      success: true,
      paymentId: event.eventData.paymentId,
      ...event.eventData
    });
  }

  /**
   * Handler: Cuando el pago falla
   */
  @EventHandler(EventSubjects.PAYMENT_FAILED)
  async onPaymentFailed(event: PaymentFailedEvent): Promise<void> {
    const orderId = event.eventData.orderId;
    console.log(`❌ Pago fallido para orden ${orderId}, cancelando orden...`);
    
    await this.sagaOrchestrator.handleSagaStep(orderId, 'PAYMENT_PROCESSED', {
      success: false,
      error: event.eventData.errorMessage,
      ...event.eventData
    });
  }
}

// ========================================
// PRODUCT SERVICE - Solo maneja su propio dominio
// ========================================

export class ProductService extends EventDrivenService {
  constructor() {
    super('product-service');
  }

  /**
   * Handler: Cuando se solicita información de productos
   */
  @EventHandler(EventSubjects.PRODUCT_INFORMATION_REQUESTED)
  async onProductInformationRequested(event: ProductInformationRequestedEvent): Promise<void> {
    const { orderId, productIds, requestId } = event.eventData;
    
    console.log(`📦 Solicitando información de productos para orden ${orderId}...`);
    
    // Simular obtención de datos de productos
    const products = productIds.map(productId => ({
      productId,
      productName: `Product ${productId}`,
      currentPrice: Math.random() * 100 + 10,
      currency: 'EUR',
      artisanId: `artisan_${Math.floor(Math.random() * 1000)}`,
      isAvailable: true,
      stockQuantity: Math.floor(Math.random() * 50) + 1
    }));

    // Publicar respuesta con información de productos
    const responseEvent = new ProductInformationProvidedEvent(requestId, {
      orderId,
      requestId,
      products,
      providedAt: new Date()
    });

    await this.publishEvent(EventSubjects.PRODUCT_INFORMATION_PROVIDED, responseEvent);
  }

  /**
   * Handler: Cuando se solicita validación de stock
   */
  @EventHandler(EventSubjects.STOCK_VALIDATION_REQUESTED)
  async onStockValidationRequested(event: StockValidationRequestedEvent): Promise<void> {
    const { orderId, items, requestId } = event.eventData;
    
    console.log(`📦 Validando stock para orden ${orderId}...`);
    
    // Simular validación de stock
    const validationResults = items.map(item => ({
      productId: item.productId,
      isAvailable: Math.random() > 0.1, // 90% de disponibilidad
      availableQuantity: Math.floor(Math.random() * 50) + 1,
      requestedQuantity: item.quantity
    }));

    const allItemsAvailable = validationResults.every(result => 
      result.isAvailable && result.availableQuantity >= result.requestedQuantity
    );

    // Publicar respuesta de validación
    const responseEvent = new StockValidationResponseEvent(requestId, {
      orderId,
      requestId,
      validationResults,
      allItemsAvailable,
      respondedAt: new Date()
    });

    await this.publishEvent(EventSubjects.STOCK_VALIDATION_RESPONSE, responseEvent);
  }
}

// ========================================
// USER SERVICE - Solo maneja su propio dominio
// ========================================

export class UserService extends EventDrivenService {
  constructor() {
    super('user-service');
  }

  /**
   * Handler: Cuando se solicita información de usuario
   */
  @EventHandler(EventSubjects.USER_INFORMATION_REQUESTED)
  async onUserInformationRequested(event: UserInformationRequestedEvent): Promise<void> {
    const { userId, requestedFields, requestId } = event.eventData;
    
    console.log(`👤 Solicitando información de usuario ${userId}...`);
    
    // Simular obtención de datos de usuario
    const userData = {
      email: `user${userId}@example.com`,
      firstName: 'John',
      lastName: 'Doe',
      address: {
        street: '123 Main St',
        city: 'Jaén',
        state: 'Andalucía',
        postalCode: '23001',
        country: 'Spain'
      },
      preferences: {
        language: 'es',
        currency: 'EUR',
        notifications: {
          email: true,
          sms: false
        }
      }
    };

    // Publicar respuesta con información de usuario
    const responseEvent = new UserInformationProvidedEvent(requestId, {
      userId,
      requestId,
      userData,
      providedAt: new Date()
    });

    await this.publishEvent(EventSubjects.USER_INFORMATION_PROVIDED, responseEvent);
  }
}

// ========================================
// PAYMENT SERVICE - Solo maneja su propio dominio
// ========================================

export class PaymentService extends EventDrivenService {
  constructor() {
    super('payment-service');
  }

  /**
   * Handler: Cuando se inicia un pago
   */
  @EventHandler(EventSubjects.PAYMENT_INITIATED)
  async onPaymentInitiated(event: any): Promise<void> {
    const { orderId, amount, currency } = event.eventData;
    
    console.log(`💳 Procesando pago para orden ${orderId}...`);
    
    // Simular procesamiento de pago
    const paymentSuccess = Math.random() > 0.2; // 80% de éxito
    
    if (paymentSuccess) {
      const paymentSucceededEvent = new PaymentSucceededEvent(
        `payment_${Date.now()}`,
        {
          orderId,
          paymentId: `payment_${Date.now()}`,
          transactionId: `txn_${Date.now()}`,
          amount,
          currency,
          fees: amount * 0.029 + 0.30, // Stripe-like fees
          netAmount: amount - (amount * 0.029 + 0.30),
          processedAt: new Date(),
          paymentGateway: 'stripe',
          authorizationCode: `auth_${Math.random().toString(36).substr(2, 9)}`
        }
      );

      await this.publishEvent(EventSubjects.PAYMENT_SUCCEEDED, paymentSucceededEvent);
      console.log(`✅ Pago exitoso para orden ${orderId}`);
    } else {
      const paymentFailedEvent = new PaymentFailedEvent(
        `payment_${Date.now()}`,
        {
          orderId,
          paymentId: `payment_${Date.now()}`,
          errorCode: 'CARD_DECLINED',
          errorMessage: 'Tarjeta rechazada',
          retryable: true,
          failedAt: new Date(),
          paymentGateway: 'stripe',
          failureReason: 'insufficient_funds',
          customerNotified: false
        }
      );

      await this.publishEvent(EventSubjects.PAYMENT_FAILED, paymentFailedEvent);
      console.log(`❌ Pago fallido para orden ${orderId}`);
    }
  }
}

// ========================================
// DEMO REFACTORIZADO - Sin dependencias directas
// ========================================

export class MarketplaceDemoRefactored {
  private eventBus: IEventBus;
  private orderService: OrderService;
  private productService: ProductService;
  private userService: UserService;
  private paymentService: PaymentService;

  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
    
    // Cada servicio se inicializa independientemente
    this.orderService = new OrderService(eventBus);
    this.productService = new ProductService();
    this.userService = new UserService();
    this.paymentService = new PaymentService();
    
    // Cada servicio se suscribe a sus eventos relevantes
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Los servicios se suscriben a eventos, no se llaman directamente
    this.productService.startEventHandling();
    this.userService.startEventHandling();
    this.paymentService.startEventHandling();
  }

  async start(): Promise<void> {
    console.log('🚀 Iniciando marketplace refactorizado...');
    await this.orderService.startEventHandling();
  }

  async stop(): Promise<void> {
    console.log('🛑 Deteniendo marketplace refactorizado...');
    await this.orderService.stopEventHandling();
    await this.productService.stopEventHandling();
    await this.userService.stopEventHandling();
    await this.paymentService.stopEventHandling();
  }

  async simulateOrder(): Promise<void> {
    console.log('\n🛒 Simulando creación de orden...');
    
    const orderData = {
      customerId: 'user_123',
      customerEmail: 'customer@example.com',
      items: [
        { productId: 'product_aceite_picual', quantity: 2 },
        { productId: 'product_queso_cabra', quantity: 1 }
      ],
      deliveryAddress: {
        street: 'Calle Mayor 123',
        city: 'Jaén',
        state: 'Andalucía',
        postalCode: '23001',
        country: 'Spain'
      }
    };

    const orderId = await this.orderService.createOrder(orderData);
    console.log(`📋 Orden ${orderId} iniciada, saga en progreso...`);
  }
}

// Función para ejecutar el demo
async function runRefactoredDemo(): Promise<void> {
  console.log('🔄 Ejecutando demo refactorizado sin dependencias directas...');
  
  // En un entorno real, esto sería un EventBus real (NATS, RabbitMQ, etc.)
  const mockEventBus: IEventBus = {
    publish: async (subject: string, event: any) => {
      console.log(`📤 Evento publicado: ${subject}`);
      // Aquí se publicaría al bus de eventos real
    },
    subscribe: async (subject: string, handler: (event: any) => Promise<void>) => {
      console.log(`📥 Suscrito a: ${subject}`);
      // Aquí se suscribiría al bus de eventos real
    }
  };

  const demo = new MarketplaceDemoRefactored(mockEventBus);
  
  try {
    await demo.start();
    await demo.simulateOrder();
    
    // Esperar un poco para que los eventos se procesen
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } finally {
    await demo.stop();
  }
}

// Exportar para uso en tests
export { runRefactoredDemo };