import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderRepository } from '../../domain/repositories/order.repository';

export interface EventMessage<T = any> {
  data: T;
  eventType?: string;
}

export enum SagaState {
  STARTED = 'STARTED',
  STOCK_RESERVED = 'STOCK_RESERVED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
}

export interface SagaContext {
  orderId: string;
  state: SagaState;
  reservationId?: string;
  paymentIntentId?: string;
  error?: string;
  startedAt: Date;
  updatedAt: Date;
}

@Injectable()
export class OrderSaga implements OnModuleInit {
  private readonly logger = new Logger(OrderSaga.name);
  private readonly sagaContexts = new Map<string, SagaContext>();
  private readonly SAGA_TIMEOUT = 30000; // 30 segundos

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('NATS_CLIENT')
    private readonly natsClient: ClientProxy,
  ) {}

  // Conectamos los listeners manualmente al iniciar el módulo
  async onModuleInit() {
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Nota: En una arquitectura ideal, estos eventos llegarían a un Controller
    // que delegaría en este servicio.
  }

  async execute(command: CreateOrderCommand): Promise<string> {
    const orderId = command.orderId;

    const sagaContext: SagaContext = {
      orderId,
      state: SagaState.STARTED,
      startedAt: new Date(),
      updatedAt: new Date(),
    };

    this.sagaContexts.set(orderId, sagaContext);
    this.logger.log(`🚀 Iniciando Saga para orden ${orderId}`);

    try {
      // 1. Verificar orden
      // CORRECCIÓN: Pasamos el string directo, no 'new OrderId(orderId)'
      const order = await this.orderRepository.findById(orderId);
      
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      // 2. Publicar evento OrderCreated para que Inventory reserve stock
      this.natsClient.emit('order.created.v1', {
        orderId,
        customerId: order.customerId,
        items: order.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        totalAmount: order.totalAmount,
        timestamp: new Date().toISOString(),
      });

      // 3. Configurar timeout de seguridad
      setTimeout(() => {
        const ctx = this.sagaContexts.get(orderId);
        if (ctx && ctx.state !== SagaState.COMPLETED && ctx.state !== SagaState.COMPENSATED) {
          this.logger.error(`⏰ Timeout de Saga para orden ${orderId}`);
          this.compensate(orderId, 'Saga Timeout');
        }
      }, this.SAGA_TIMEOUT);

      this.logger.log(`✅ Saga iniciada para orden ${orderId} -> Esperando Reserva`);
      return orderId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Error iniciando saga para orden ${orderId}:`, errorMessage);
      await this.compensate(orderId, errorMessage);
      throw error;
    }
  }

  // Llamado cuando Inventory Service responde con éxito
  async handleInventoryReserved(event: EventMessage): Promise<void> {
    const { orderId, reservationId } = event.data;
    const context = this.sagaContexts.get(orderId);

    if (!context) {
      this.logger.warn(`⚠️ Contexto no encontrado para orden ${orderId}`);
      return;
    }

    context.state = SagaState.STOCK_RESERVED;
    context.reservationId = reservationId;
    context.updatedAt = new Date();
    this.logger.log(`📦 Stock reservado (${reservationId}). Iniciando pago...`);

    // Publicar evento para que Payment Service procese el pago
    this.natsClient.emit('payment.initiate', {
      orderId,
      amount: event.data.totalAmount,
      customerId: event.data.customerId,
      timestamp: new Date().toISOString(),
    });

    context.state = SagaState.PAYMENT_PENDING;
  }

  // Llamado cuando Inventory Service falla
  async handleInventoryOutOfStock(event: EventMessage): Promise<void> {
    const { orderId } = event.data;
    this.logger.error(`❌ Stock insuficiente para orden ${orderId}`);
    await this.compensate(orderId, 'Stock insuficiente');
  }

  // Llamado cuando Payment Service responde con éxito
  async handlePaymentSucceeded(event: EventMessage): Promise<void> {
    const { orderId, paymentIntentId } = event.data;
    const context = this.sagaContexts.get(orderId);

    if (!context) return;

    try {
      // CORRECCIÓN: Pasamos el string directo
      const order = await this.orderRepository.findById(orderId);
      
      if (order) {
        order.confirmPayment(); // Método de dominio
        await this.orderRepository.save(order);
      }

      context.state = SagaState.COMPLETED;
      context.paymentIntentId = paymentIntentId;

      this.logger.log(`✅ SAGA COMPLETADA EXITOSAMENTE para orden ${orderId}`);

      // Publicar evento final
      this.natsClient.emit('order.completed.v1', {
        orderId,
        paymentIntentId,
        status: 'COMPLETED'
      });

      // Limpieza
      this.sagaContexts.delete(orderId);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Error finalizando orden ${orderId}`, errorMessage);
    }
  }

  // Llamado cuando Payment Service falla
  async handlePaymentFailed(event: EventMessage): Promise<void> {
    const { orderId, reason } = event.data;
    this.logger.error(`❌ Pago fallido para orden ${orderId}: ${reason}`);
    await this.compensate(orderId, `Pago fallido: ${reason}`);
  }

  // Lógica de Compensación (Rollback)
  private async compensate(orderId: string, reason: string): Promise<void> {
    const context = this.sagaContexts.get(orderId);

    if (!context) {
      this.logger.warn(`⚠️ No se puede compensar orden ${orderId}: Contexto perdido`);
      return;
    }

    if (context.state === SagaState.COMPENSATING || context.state === SagaState.COMPENSATED) {
      return;
    }

    context.state = SagaState.COMPENSATING;
    context.error = reason;
    this.logger.log(`🔄 EJECUTANDO COMPENSACIÓN para orden ${orderId}. Razón: ${reason}`);

    try {
      // 1. Si se reservó stock, hay que liberarlo
      if (context.reservationId) {
        this.logger.log(`🔄 Liberando stock ${context.reservationId}...`);
        this.natsClient.emit('inventory.release', {
          orderId,
          reservationId: context.reservationId,
          reason: 'Saga Compensation',
        });
      }

      // 2. Si se hizo un pago (caso raro de fallo posterior), reembolsar
      if (context.paymentIntentId) {
        this.logger.log(`🔄 Reembolsando pago ${context.paymentIntentId}...`);
        this.natsClient.emit('payment.refund', {
          orderId,
          paymentIntentId: context.paymentIntentId,
          reason: 'Saga Compensation',
        });
      }

      // 3. Marcar orden como cancelada en DB local
      // CORRECCIÓN: Pasamos el string directo
      const order = await this.orderRepository.findById(orderId);
      
      if (order) {
        order.cancel(reason); // Método de dominio
        await this.orderRepository.save(order);
      }

      // 4. Notificar cancelación global
      this.natsClient.emit('order.cancelled.v1', {
        orderId,
        reason,
      });

      context.state = SagaState.COMPENSATED;
      this.logger.log(`🏁 Compensación finalizada para orden ${orderId}`);

      // Limpieza final
      this.sagaContexts.delete(orderId);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`�� ERROR CRÍTICO EN COMPENSACIÓN orden ${orderId}`, errorMessage);
    }
  }
}
