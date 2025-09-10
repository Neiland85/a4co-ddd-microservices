/**
 * Ejemplo Práctico: Order Creation Saga
 *
 * Este ejemplo muestra cómo implementar el patrón Saga para
 * el proceso completo de creación de pedidos usando eventos.
 */

import {
  EventDrivenService,
  EventHandler,
  IEventBus,
} from '../packages/shared-utils/src/events/event-bus';
import { EventSubjects } from '../packages/shared-utils/src/events/subjects';
import {
  OrderCreatedEvent,
  OrderConfirmedEvent,
  OrderCancelledEvent,
  StockReservedEvent,
  StockReleasedEvent,
  PaymentSucceededEvent,
  PaymentFailedEvent,
  EmailSentEvent,
} from '../packages/shared-utils/src/events/domain-events';

// ========================================
// ORDER SERVICE IMPLEMENTATION
// ========================================

export class OrderService extends EventDrivenService {
  constructor() {
    super('order-service');
  }

  /**
   * Crear una nueva orden
   * Este es el punto de entrada del proceso
   */
  async createOrder(orderData: {
    customerId: string;
    customerEmail: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      artisanId: string;
    }>;
    deliveryAddress: any;
  }): Promise<string> {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calcular totales
    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    // Crear evento de orden creada
    const orderCreatedEvent = new OrderCreatedEvent(orderId, {
      customerId: orderData.customerId,
      customerEmail: orderData.customerEmail,
      items: orderData.items.map(item => ({
        ...item,
        totalPrice: item.quantity * item.unitPrice,
      })),
      totalAmount,
      currency: 'EUR',
      deliveryAddress: orderData.deliveryAddress,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
      createdAt: new Date(),
    });

    // Publicar evento para iniciar el saga
    await this.publishEvent(EventSubjects.ORDER_CREATED, orderCreatedEvent);

    console.log(`✅ Orden ${orderId} creada, iniciando proceso de validación...`);
    return orderId;
  }

  /**
   * Handler: Cuando el stock es reservado correctamente
   */
  @EventHandler(EventSubjects.STOCK_RESERVED)
  async onStockReserved(event: StockReservedEvent): Promise<void> {
    console.log(`📦 Stock reservado para producto ${event.aggregateId}, continuando con pago...`);

    // Aquí normalmente buscaríamos la orden en la base de datos
    // Por simplicidad, asumimos que tenemos los datos

    // El saga continúa automáticamente - el payment service
    // está subscrito a ORDER_CREATED y procesará el pago
  }

  /**
   * Handler: Cuando el pago es exitoso
   */
  @EventHandler(EventSubjects.PAYMENT_SUCCEEDED)
  async onPaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    const orderId = event.eventData.orderId;

    console.log(`💳 Pago exitoso para orden ${orderId}, confirmando orden...`);

    // Confirmar la orden
    const orderConfirmedEvent = new OrderConfirmedEvent(orderId, {
      confirmedAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      paymentReference: event.eventData.transactionId,
      artisanNotified: true,
      trackingNumber: `TRK${Date.now()}`,
    });

    await this.publishEvent(EventSubjects.ORDER_CONFIRMED, orderConfirmedEvent);
  }

  /**
   * Handler: Cuando el pago falla
   */
  @EventHandler(EventSubjects.PAYMENT_FAILED)
  async onPaymentFailed(event: PaymentFailedEvent): Promise<void> {
    const orderId = event.eventData.orderId;

    console.log(`❌ Pago fallido para orden ${orderId}, cancelando orden...`);

    // Cancelar la orden
    const orderCancelledEvent = new OrderCancelledEvent(orderId, {
      reason: `Pago fallido: ${event.eventData.errorMessage}`,
      cancelledAt: new Date(),
      cancelledBy: 'system',
      refundRequired: false,
      notificationSent: false,
    });

    await this.publishEvent(EventSubjects.ORDER_CANCELLED, orderCancelledEvent);
  }
}

// ========================================
// INVENTORY SERVICE IMPLEMENTATION
// ========================================

export class InventoryService extends EventDrivenService {
  // Simulamos un inventario en memoria
  private inventory: Map<string, number> = new Map([
    ['product_aceite_picual', 50],
    ['product_queso_cabra', 25],
    ['product_miel_azahar', 100],
    ['product_jamon_iberico', 15],
  ]);

  constructor() {
    super('inventory-service');
  }

  /**
   * Handler: Cuando se crea una orden, intentar reservar stock
   */
  @EventHandler(EventSubjects.ORDER_CREATED)
  async onOrderCreated(event: OrderCreatedEvent): Promise<void> {
    const orderId = event.aggregateId;
    const items = event.eventData.items;

    console.log(`📦 Verificando stock para orden ${orderId}...`);

    // Verificar si hay stock suficiente para todos los items
    const stockChecks = items.map(item => ({
      productId: item.productId,
      requested: item.quantity,
      available: this.inventory.get(item.productId) || 0,
    }));

    const insufficientStock = stockChecks.find(check => check.available < check.requested);

    if (insufficientStock) {
      console.log(`❌ Stock insuficiente para ${insufficientStock.productId}`);

      // Cancelar orden por falta de stock
      const orderCancelledEvent = new OrderCancelledEvent(orderId, {
        reason: `Stock insuficiente para producto ${insufficientStock.productId}`,
        cancelledAt: new Date(),
        cancelledBy: 'system',
        refundRequired: false,
        notificationSent: true,
      });

      await this.publishEvent(EventSubjects.ORDER_CANCELLED, orderCancelledEvent);
      return;
    }

    // Reservar stock para todos los items
    for (const item of items) {
      const currentStock = this.inventory.get(item.productId) || 0;
      this.inventory.set(item.productId, currentStock - item.quantity);

      // Publicar evento de stock reservado
      const stockReservedEvent = new StockReservedEvent(item.productId, {
        orderId,
        quantityReserved: item.quantity,
        remainingStock: currentStock - item.quantity,
        reservationExpiry: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
        reservedAt: new Date(),
        artisanId: item.artisanId,
      });

      await this.publishEvent(EventSubjects.STOCK_RESERVED, stockReservedEvent);
    }

    console.log(`✅ Stock reservado para orden ${orderId}`);
  }

  /**
   * Handler: Cuando se cancela una orden, liberar stock
   */
  @EventHandler(EventSubjects.ORDER_CANCELLED)
  async onOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    const orderId = event.aggregateId;

    console.log(`🔄 Liberando stock para orden cancelada ${orderId}...`);

    // En un caso real, buscaríamos las reservas en la base de datos
    // Por simplicidad, asumimos que liberamos el stock

    console.log(`✅ Stock liberado para orden ${orderId}`);
  }
}

// ========================================
// PAYMENT SERVICE IMPLEMENTATION
// ========================================

export class PaymentService extends EventDrivenService {
  constructor() {
    super('payment-service');
  }

  /**
   * Handler: Cuando el stock es reservado, procesar pago
   */
  @EventHandler(EventSubjects.STOCK_RESERVED)
  async onStockReserved(event: StockReservedEvent): Promise<void> {
    const orderId = event.eventData.orderId;

    console.log(`💳 Iniciando procesamiento de pago para orden ${orderId}...`);

    // Simular procesamiento de pago
    const paymentSuccess = Math.random() > 0.2; // 80% de éxito

    setTimeout(async () => {
      if (paymentSuccess) {
        const paymentSucceededEvent = new PaymentSucceededEvent(`payment_${Date.now()}`, {
          orderId,
          transactionId: `txn_${Date.now()}`,
          amount: 25.5, // Simulado
          currency: 'EUR',
          fees: 0.75,
          netAmount: 24.75,
          processedAt: new Date(),
          paymentGateway: 'stripe',
          authorizationCode: `auth_${Math.random().toString(36).substr(2, 9)}`,
        });

        await this.publishEvent(EventSubjects.PAYMENT_SUCCEEDED, paymentSucceededEvent);
        console.log(`✅ Pago exitoso para orden ${orderId}`);
      } else {
        const paymentFailedEvent = new PaymentFailedEvent(`payment_${Date.now()}`, {
          orderId,
          errorCode: 'CARD_DECLINED',
          errorMessage: 'Tarjeta rechazada por el banco',
          retryable: true,
          failedAt: new Date(),
          paymentGateway: 'stripe',
          failureReason: 'Insufficient funds',
          customerNotified: false,
        });

        await this.publishEvent(EventSubjects.PAYMENT_FAILED, paymentFailedEvent);
        console.log(`❌ Pago fallido para orden ${orderId}`);
      }
    }, 2000); // Simular delay de procesamiento
  }
}

// ========================================
// NOTIFICATION SERVICE IMPLEMENTATION
// ========================================

export class NotificationService extends EventDrivenService {
  constructor() {
    super('notification-service');
  }

  /**
   * Handler: Cuando se confirma una orden, enviar notificación
   */
  @EventHandler(EventSubjects.ORDER_CONFIRMED)
  async onOrderConfirmed(event: OrderConfirmedEvent): Promise<void> {
    const orderId = event.aggregateId;

    console.log(`📧 Enviando confirmación por email para orden ${orderId}...`);

    // Simular envío de email
    const emailSentEvent = new EmailSentEvent(`email_${Date.now()}`, {
      recipientEmail: 'customer@example.com', // En un caso real, buscaríamos el email
      recipientName: 'Cliente',
      subject: `Confirmación de pedido #${orderId}`,
      template: 'order-confirmation',
      variables: {
        orderId,
        trackingNumber: event.eventData.trackingNumber,
        estimatedDelivery: event.eventData.estimatedDelivery,
      },
      sentAt: new Date(),
      provider: 'sendgrid',
      messageId: `msg_${Date.now()}`,
    });

    await this.publishEvent(EventSubjects.EMAIL_SENT, emailSentEvent);
    console.log(`✅ Email de confirmación enviado para orden ${orderId}`);
  }

  /**
   * Handler: Cuando se cancela una orden, enviar notificación
   */
  @EventHandler(EventSubjects.ORDER_CANCELLED)
  async onOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    const orderId = event.aggregateId;

    if (event.eventData.notificationSent) {
      return; // Ya se envió notificación
    }

    console.log(`📧 Enviando notificación de cancelación para orden ${orderId}...`);

    const emailSentEvent = new EmailSentEvent(`email_${Date.now()}`, {
      recipientEmail: 'customer@example.com',
      recipientName: 'Cliente',
      subject: `Orden #${orderId} cancelada`,
      template: 'order-cancellation',
      variables: {
        orderId,
        reason: event.eventData.reason,
        refundRequired: event.eventData.refundRequired,
      },
      sentAt: new Date(),
      provider: 'sendgrid',
      messageId: `msg_${Date.now()}`,
    });

    await this.publishEvent(EventSubjects.EMAIL_SENT, emailSentEvent);
    console.log(`✅ Email de cancelación enviado para orden ${orderId}`);
  }
}

// ========================================
// DEMO APPLICATION
// ========================================

export class MarketplaceDemo {
  private orderService: OrderService;
  private inventoryService: InventoryService;
  private paymentService: PaymentService;
  private notificationService: NotificationService;

  constructor() {
    this.orderService = new OrderService();
    this.inventoryService = new InventoryService();
    this.paymentService = new PaymentService();
    this.notificationService = new NotificationService();
  }

  async start(): Promise<void> {
    console.log('🚀 Iniciando demo del marketplace...');

    // Conectar todos los servicios al event bus
    await Promise.all([
      this.orderService.startEventHandling(),
      this.inventoryService.startEventHandling(),
      this.paymentService.startEventHandling(),
      this.notificationService.startEventHandling(),
    ]);

    console.log('✅ Todos los servicios conectados y listos');
  }

  async stop(): Promise<void> {
    console.log('⏹️ Deteniendo servicios...');

    await Promise.all([
      this.orderService.stopEventHandling(),
      this.inventoryService.stopEventHandling(),
      this.paymentService.stopEventHandling(),
      this.notificationService.stopEventHandling(),
    ]);

    console.log('✅ Todos los servicios detenidos');
  }

  async simulateOrder(): Promise<void> {
    console.log('\n🛒 Simulando creación de pedido...');

    const orderId = await this.orderService.createOrder({
      customerId: 'customer_123',
      customerEmail: 'cliente@jaen.com',
      items: [
        {
          productId: 'product_aceite_picual',
          productName: 'Aceite Picual de Úbeda',
          quantity: 2,
          unitPrice: 12.5,
          artisanId: 'artisan_olivares_ubeda',
        },
      ],
      deliveryAddress: {
        street: 'Calle Real 123',
        city: 'Jaén',
        state: 'Andalucía',
        postalCode: '23001',
        country: 'España',
      },
    });

    console.log(`📋 Orden ${orderId} en proceso...`);
  }
}

// ========================================
// EJECUCIÓN DEL DEMO
// ========================================

async function runDemo(): Promise<void> {
  const demo = new MarketplaceDemo();

  try {
    await demo.start();

    // Simular varias órdenes
    for (let i = 0; i < 3; i++) {
      await demo.simulateOrder();
      await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos entre órdenes
    }

    // Esperar a que se procesen todos los eventos
    console.log('\n⏳ Esperando a que se procesen todos los eventos...');
    await new Promise(resolve => setTimeout(resolve, 10000));
  } finally {
    await demo.stop();
  }
}

// Ejecutar demo si se ejecuta directamente
if (require.main === module) {
  runDemo().catch(console.error);
}

export { runDemo };
