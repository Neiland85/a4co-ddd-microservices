import { OrderService } from './service';

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  it('should create an order', () => {
    const result = orderService.createOrder('order123', ['item1', 'item2']);
    expect(result).toBe(
      'Orden order123 creada con los siguientes ítems: item1, item2.'
    );
  });

  it('should get order information', () => {
    const result = orderService.getOrder('order123');
    expect(result).toBe('Información de la orden order123.');
  });
});
