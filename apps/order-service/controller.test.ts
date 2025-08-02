import { OrderController } from './controller';
import { OrderService } from './service';

// Mock the OrderService
jest.mock('./service');

describe('OrderController', () => {
  let controller: OrderController;
  let mockOrderService: jest.Mocked<OrderService>;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new OrderController();
    mockOrderService = (controller as any).orderService as jest.Mocked<OrderService>;
  });

  describe('createOrder', () => {
    it('should create an order with valid data', () => {
      const request = { orderId: 'ORD-001', items: ['laptop', 'mouse'] };
      const expectedResult = 'Orden ORD-001 creada con los siguientes ítems: laptop, mouse.';
      
      mockOrderService.createOrder.mockReturnValue(expectedResult);

      const result = controller.createOrder(request);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-001', ['laptop', 'mouse']);
      expect(result).toBe(expectedResult);
    });

    it('should handle empty items array', () => {
      const request = { orderId: 'ORD-002', items: [] };
      const expectedResult = 'Orden ORD-002 creada con los siguientes ítems: .';
      
      mockOrderService.createOrder.mockReturnValue(expectedResult);

      const result = controller.createOrder(request);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-002', []);
      expect(result).toBe(expectedResult);
    });

    it('should handle single item', () => {
      const request = { orderId: 'ORD-003', items: ['smartphone'] };
      const expectedResult = 'Orden ORD-003 creada con los siguientes ítems: smartphone.';
      
      mockOrderService.createOrder.mockReturnValue(expectedResult);

      const result = controller.createOrder(request);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-003', ['smartphone']);
      expect(result).toBe(expectedResult);
    });

    it('should handle many items', () => {
      const items = Array.from({ length: 50 }, (_, i) => `item-${i}`);
      const request = { orderId: 'ORD-004', items };
      const expectedResult = `Orden ORD-004 creada con los siguientes ítems: ${items.join(', ')}.`;
      
      mockOrderService.createOrder.mockReturnValue(expectedResult);

      const result = controller.createOrder(request);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-004', items);
      expect(result).toBe(expectedResult);
    });

    it('should handle special characters in order ID', () => {
      const request = { orderId: 'ORD-特殊-001', items: ['item1'] };
      const expectedResult = 'Orden ORD-特殊-001 creada con los siguientes ítems: item1.';
      
      mockOrderService.createOrder.mockReturnValue(expectedResult);

      const result = controller.createOrder(request);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-特殊-001', ['item1']);
      expect(result).toBe(expectedResult);
    });

    it('should handle special characters in items', () => {
      const request = { 
        orderId: 'ORD-005', 
        items: ['Café "Premium"', 'T-shirt & Jeans', '手机'] 
      };
      const expectedResult = 'Orden ORD-005 creada con los siguientes ítems: Café "Premium", T-shirt & Jeans, 手机.';
      
      mockOrderService.createOrder.mockReturnValue(expectedResult);

      const result = controller.createOrder(request);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-005', ['Café "Premium"', 'T-shirt & Jeans', '手机']);
      expect(result).toBe(expectedResult);
    });

    it('should handle duplicate items', () => {
      const request = { orderId: 'ORD-006', items: ['laptop', 'laptop', 'mouse', 'laptop'] };
      const expectedResult = 'Orden ORD-006 creada con los siguientes ítems: laptop, laptop, mouse, laptop.';
      
      mockOrderService.createOrder.mockReturnValue(expectedResult);

      const result = controller.createOrder(request);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-006', ['laptop', 'laptop', 'mouse', 'laptop']);
      expect(result).toBe(expectedResult);
    });

    it('should handle empty strings in items', () => {
      const request = { orderId: 'ORD-007', items: ['', 'valid-item', ''] };
      const expectedResult = 'Orden ORD-007 creada con los siguientes ítems: , valid-item, .';
      
      mockOrderService.createOrder.mockReturnValue(expectedResult);

      const result = controller.createOrder(request);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-007', ['', 'valid-item', '']);
      expect(result).toBe(expectedResult);
    });

    it('should propagate service errors', () => {
      const request = { orderId: 'ORD-ERROR', items: ['item1'] };
      const serviceError = new Error('Order creation failed');
      
      mockOrderService.createOrder.mockImplementation(() => {
        throw serviceError;
      });

      expect(() => controller.createOrder(request)).toThrow('Order creation failed');
      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-ERROR', ['item1']);
    });

    it('should handle null/undefined values', () => {
      const request = { orderId: null as any, items: undefined as any };
      const expectedResult = 'Orden null creada con los siguientes ítems: undefined.';
      
      mockOrderService.createOrder.mockReturnValue(expectedResult);

      const result = controller.createOrder(request);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(null, undefined);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getOrder', () => {
    it('should get order information with valid order ID', () => {
      const request = { orderId: 'ORD-001' };
      const expectedResult = 'Información de la orden ORD-001.';
      
      mockOrderService.getOrder.mockReturnValue(expectedResult);

      const result = controller.getOrder(request);

      expect(mockOrderService.getOrder).toHaveBeenCalledWith('ORD-001');
      expect(result).toBe(expectedResult);
    });

    it('should handle empty order ID', () => {
      const request = { orderId: '' };
      const expectedResult = 'Información de la orden .';
      
      mockOrderService.getOrder.mockReturnValue(expectedResult);

      const result = controller.getOrder(request);

      expect(mockOrderService.getOrder).toHaveBeenCalledWith('');
      expect(result).toBe(expectedResult);
    });

    it('should handle special characters in order ID', () => {
      const request = { orderId: 'ORD-特殊-001' };
      const expectedResult = 'Información de la orden ORD-特殊-001.';
      
      mockOrderService.getOrder.mockReturnValue(expectedResult);

      const result = controller.getOrder(request);

      expect(mockOrderService.getOrder).toHaveBeenCalledWith('ORD-特殊-001');
      expect(result).toBe(expectedResult);
    });

    it('should handle very long order ID', () => {
      const longOrderId = 'ORD-' + 'A'.repeat(1000);
      const request = { orderId: longOrderId };
      const expectedResult = `Información de la orden ${longOrderId}.`;
      
      mockOrderService.getOrder.mockReturnValue(expectedResult);

      const result = controller.getOrder(request);

      expect(mockOrderService.getOrder).toHaveBeenCalledWith(longOrderId);
      expect(result).toBe(expectedResult);
    });

    it('should propagate service errors', () => {
      const request = { orderId: 'ORD-NOTFOUND' };
      const serviceError = new Error('Order not found');
      
      mockOrderService.getOrder.mockImplementation(() => {
        throw serviceError;
      });

      expect(() => controller.getOrder(request)).toThrow('Order not found');
      expect(mockOrderService.getOrder).toHaveBeenCalledWith('ORD-NOTFOUND');
    });

    it('should handle null/undefined order ID', () => {
      const request = { orderId: null as any };
      const expectedResult = 'Información de la orden null.';
      
      mockOrderService.getOrder.mockReturnValue(expectedResult);

      const result = controller.getOrder(request);

      expect(mockOrderService.getOrder).toHaveBeenCalledWith(null);
      expect(result).toBe(expectedResult);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete order workflow', () => {
      const createRequest = { orderId: 'ORD-WORKFLOW', items: ['laptop', 'mouse'] };
      const getRequest = { orderId: 'ORD-WORKFLOW' };
      
      mockOrderService.createOrder.mockReturnValue('Order created');
      mockOrderService.getOrder.mockReturnValue('Order retrieved');

      // Create order
      const createResult = controller.createOrder(createRequest);
      expect(createResult).toBe('Order created');

      // Get order
      const getResult = controller.getOrder(getRequest);
      expect(getResult).toBe('Order retrieved');

      expect(mockOrderService.createOrder).toHaveBeenCalledTimes(1);
      expect(mockOrderService.getOrder).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple orders independently', () => {
      const orders = [
        { orderId: 'ORD-001', items: ['item1'] },
        { orderId: 'ORD-002', items: ['item2', 'item3'] },
        { orderId: 'ORD-003', items: [] }
      ];

      mockOrderService.createOrder.mockReturnValue('Created');

      orders.forEach(order => {
        controller.createOrder(order);
      });

      expect(mockOrderService.createOrder).toHaveBeenCalledTimes(3);
      expect(mockOrderService.createOrder).toHaveBeenNthCalledWith(1, 'ORD-001', ['item1']);
      expect(mockOrderService.createOrder).toHaveBeenNthCalledWith(2, 'ORD-002', ['item2', 'item3']);
      expect(mockOrderService.createOrder).toHaveBeenNthCalledWith(3, 'ORD-003', []);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large number of items efficiently', () => {
      const items = Array.from({ length: 10000 }, (_, i) => `item-${i}`);
      const request = { orderId: 'ORD-LARGE', items };
      
      mockOrderService.createOrder.mockReturnValue('Large order created');

      const startTime = Date.now();
      const result = controller.createOrder(request);
      const endTime = Date.now();

      expect(result).toBe('Large order created');
      expect(mockOrderService.createOrder).toHaveBeenCalledWith('ORD-LARGE', items);
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
    });

    it('should handle rapid sequential calls', () => {
      mockOrderService.createOrder.mockReturnValue('Created');
      mockOrderService.getOrder.mockReturnValue('Retrieved');

      const startTime = Date.now();
      for (let i = 0; i < 1000; i++) {
        controller.createOrder({ orderId: `ORD-${i}`, items: [`item${i}`] });
        controller.getOrder({ orderId: `ORD-${i}` });
      }
      const endTime = Date.now();

      expect(mockOrderService.createOrder).toHaveBeenCalledTimes(1000);
      expect(mockOrderService.getOrder).toHaveBeenCalledTimes(1000);
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});