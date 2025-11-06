import { Order, OrderItem, OrderStatus, OrderCreatedEvent, OrderStatusChangedEvent, OrderCompletedEvent, OrderCancelledEvent, OrderFailedEvent } from '../../domain/aggregates/order.aggregate';

describe('Order Aggregate', () => {
    describe('Creación de orden', () => {
        it('debe crear una orden con estado PENDING', () => {
            const items = [
                new OrderItem('product-1', 2, 10.0, 'EUR'),
                new OrderItem('product-2', 1, 20.0, 'EUR'),
            ];

            const order = new Order('order-1', 'customer-1', items);

            expect(order.id).toBe('order-1');
            expect(order.customerId).toBe('customer-1');
            expect(order.status).toBe(OrderStatus.PENDING);
            expect(order.totalAmount).toBe(40.0);
            expect(order.items).toHaveLength(2);
        });

        it('debe emitir OrderCreatedEvent al crear una nueva orden', () => {
            const items = [new OrderItem('product-1', 1, 10.0)];
            const order = new Order('order-1', 'customer-1', items);

            const events = order.domainEvents;
            expect(events).toHaveLength(1);
            expect(events[0]).toBeInstanceOf(OrderCreatedEvent);
            expect((events[0] as OrderCreatedEvent).orderId).toBe('order-1');
        });

        it('no debe emitir OrderCreatedEvent al reconstruir una orden existente', () => {
            const items = [new OrderItem('product-1', 1, 10.0)];
            const order = Order.reconstruct(
                'order-1',
                'customer-1',
                items,
                OrderStatus.PENDING,
                new Date(),
                new Date(),
            );

            expect(order.domainEvents).toHaveLength(0);
        });
    });

    describe('confirmPayment', () => {
        it('debe cambiar el estado de PENDING a PAYMENT_CONFIRMED', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);

            order.confirmPayment();

            expect(order.status).toBe(OrderStatus.PAYMENT_CONFIRMED);
            expect(order.domainEvents.some((e) => e instanceof OrderStatusChangedEvent)).toBe(true);
        });

        it('debe lanzar error si el estado no es PENDING', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.confirmPayment();

            expect(() => order.confirmPayment()).toThrow('Cannot confirm payment');
        });
    });

    describe('reserveInventory', () => {
        it('debe cambiar el estado de PAYMENT_CONFIRMED a INVENTORY_RESERVED', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.confirmPayment();

            order.reserveInventory();

            expect(order.status).toBe(OrderStatus.INVENTORY_RESERVED);
        });

        it('debe lanzar error si el estado no es PAYMENT_CONFIRMED', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);

            expect(() => order.reserveInventory()).toThrow('Cannot reserve inventory');
        });
    });

    describe('complete', () => {
        it('debe cambiar el estado de INVENTORY_RESERVED a COMPLETED', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.confirmPayment();
            order.reserveInventory();

            order.complete();

            expect(order.status).toBe(OrderStatus.COMPLETED);
            expect(order.domainEvents.some((e) => e instanceof OrderCompletedEvent)).toBe(true);
        });

        it('debe lanzar error si el estado no es INVENTORY_RESERVED', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);

            expect(() => order.complete()).toThrow('Cannot complete order');
        });
    });

    describe('cancel', () => {
        it('debe cambiar el estado a CANCELLED desde cualquier estado válido', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);

            order.cancel('Customer requested cancellation');

            expect(order.status).toBe(OrderStatus.CANCELLED);
            expect(order.domainEvents.some((e) => e instanceof OrderCancelledEvent)).toBe(true);
        });

        it('debe poder cancelar desde PAYMENT_CONFIRMED', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.confirmPayment();

            order.cancel('Payment issue');

            expect(order.status).toBe(OrderStatus.CANCELLED);
        });

        it('no debe poder cancelar una orden COMPLETED', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.confirmPayment();
            order.reserveInventory();
            order.complete();

            expect(() => order.cancel('Too late')).toThrow('Cannot cancel a completed order');
        });

        it('no debe hacer nada si ya está cancelada', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.cancel('First cancellation');
            const eventCount = order.domainEvents.length;

            order.cancel('Second cancellation');

            expect(order.status).toBe(OrderStatus.CANCELLED);
            expect(order.domainEvents.length).toBe(eventCount);
        });
    });

    describe('markAsFailed', () => {
        it('debe cambiar el estado a FAILED', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);

            order.markAsFailed('System error');

            expect(order.status).toBe(OrderStatus.FAILED);
            expect(order.domainEvents.some((e) => e instanceof OrderFailedEvent)).toBe(true);
        });

        it('no debe poder marcar como fallida una orden COMPLETED', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.confirmPayment();
            order.reserveInventory();
            order.complete();

            expect(() => order.markAsFailed('Error')).toThrow('Cannot mark as failed');
        });

        it('no debe hacer nada si ya está marcada como fallida', () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.markAsFailed('First failure');
            const eventCount = order.domainEvents.length;

            order.markAsFailed('Second failure');

            expect(order.status).toBe(OrderStatus.FAILED);
            expect(order.domainEvents.length).toBe(eventCount);
        });
    });

    describe('OrderItem', () => {
        it('debe calcular el precio total correctamente', () => {
            const item = new OrderItem('product-1', 3, 10.0);

            expect(item.totalPrice).toBe(30.0);
        });

        it('debe lanzar error si la cantidad es negativa o cero', () => {
            expect(() => new OrderItem('product-1', 0, 10.0)).toThrow('Quantity must be positive');
            expect(() => new OrderItem('product-1', -1, 10.0)).toThrow('Quantity must be positive');
        });

        it('debe lanzar error si el precio unitario es negativo', () => {
            expect(() => new OrderItem('product-1', 1, -10.0)).toThrow('Unit price cannot be negative');
        });
    });
});
