/**
 * API helper for E2E tests
 * Provides methods to interact with backend services
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface Order {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentId?: string;
}

export interface Payment {
  paymentId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
}

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8081';

/**
 * Make authenticated API request
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${GATEWAY_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Get products from catalog
 */
export async function getProducts(token?: string): Promise<Product[]> {
  const response = await apiRequest('/api/v1/products', {}, token);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Create a new order
 */
export async function createOrder(
  order: CreateOrderRequest,
  token: string
): Promise<Order> {
  const response = await apiRequest(
    '/api/v1/orders',
    {
      method: 'POST',
      body: JSON.stringify(order),
    },
    token
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create order: ${response.statusText} - ${error}`);
  }

  return await response.json();
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string, token: string): Promise<Order> {
  const response = await apiRequest(`/api/v1/orders/${orderId}`, {}, token);

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get payment by order ID
 */
export async function getPaymentByOrderId(
  orderId: string,
  token: string
): Promise<Payment> {
  const response = await apiRequest(`/api/v1/payments/order/${orderId}`, {}, token);

  if (!response.ok) {
    throw new Error(`Failed to fetch payment: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Wait for order to reach expected status
 */
export async function waitForOrderStatus(
  orderId: string,
  expectedStatus: string,
  token: string,
  timeoutMs: number = 10000,
  pollIntervalMs: number = 500
): Promise<Order> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const order = await getOrder(orderId, token);

    if (order.status === expectedStatus) {
      return order;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(
    `Order ${orderId} did not reach status ${expectedStatus} within ${timeoutMs}ms`
  );
}

/**
 * Wait for payment to reach expected status
 */
export async function waitForPaymentStatus(
  orderId: string,
  expectedStatus: string,
  token: string,
  timeoutMs: number = 10000,
  pollIntervalMs: number = 500
): Promise<Payment> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      const payment = await getPaymentByOrderId(orderId, token);

      if (payment.status === expectedStatus) {
        return payment;
      }
    } catch (error) {
      // Payment might not exist yet, continue polling
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(
    `Payment for order ${orderId} did not reach status ${expectedStatus} within ${timeoutMs}ms`
  );
}
