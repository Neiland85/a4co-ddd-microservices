import type {
  CreateOrderInput,
  CreateOrderResult,
  Order,
  OrderEvent,
  OrderItem,
  Product,
} from './types';

const ORDERS_STORAGE_KEY = 'a4co-dashboard-orders';

const demoProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Pack Operativo Básico',
    description: 'Producto demo para validar el flujo de compra del dashboard.',
    price: 99,
    stock: 12,
  },
  {
    id: 'prod-002',
    name: 'Pack Profesional',
    description: 'Producto demo con trazabilidad y gestión operativa ampliada.',
    price: 249,
    stock: 6,
  },
  {
    id: 'prod-003',
    name: 'Pack Enterprise',
    description: 'Producto demo orientado a validación comercial enterprise.',
    price: 499,
    stock: 3,
  },
];

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readOrders(): Order[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function createOrderEvent(type: string, data?: unknown): OrderEvent {
  return {
    id: createId('evt'),
    type,
    timestamp: new Date().toISOString(),
    data,
  };
}

export const productsService = {
  async getProducts(): Promise<Product[]> {
    return demoProducts;
  },

  async getProduct(productId: string): Promise<Product> {
    const product = demoProducts.find((item) => item.id === productId);

    if (!product) {
      throw new Error('Producto no encontrado.');
    }

    return product;
  },
};

export const ordersService = {
  async getMyOrders(): Promise<Order[]> {
    return readOrders().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async getOrder(orderId: string): Promise<Order> {
    const order = readOrders().find(
      (item) => item.id === orderId || item.orderId === orderId,
    );

    if (!order) {
      throw new Error('Orden no encontrada.');
    }

    return order;
  },

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const items: OrderItem[] = input.items.map((item) => {
      const product = demoProducts.find((candidate) => candidate.id === item.productId);
      const price = product?.price ?? 0;

      return {
        productId: item.productId,
        productName: product?.name,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const id = createId('ord');

    const order: Order = {
      id,
      orderId: id,
      status: 'PENDING',
      items,
      totalAmount,
      createdAt: new Date().toISOString(),
      shippingAddress: input.shippingAddress,
      events: [
        createOrderEvent('order.created', {
          itemCount: items.length,
          totalAmount,
        }),
      ],
    };

    writeOrders([order, ...readOrders()]);

    return {
      orderId: order.id,
      order,
    };
  },
};
