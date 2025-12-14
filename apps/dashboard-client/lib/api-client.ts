const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText,
        }));

        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new ApiError('Sesión expirada, por favor inicia sesión', 401, errorData.error);
        }

        throw new ApiError(
          errorData.message || 'API request failed',
          response.status,
          errorData.error,
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Network error
      throw new ApiError('Error de conexión. Por favor verifica tu conexión a internet.', 0);
    }
  }

  // Auth endpoints
  async login(credentials: { username: string; password: string }) {
    return this.request<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: { username: string; email: string; password: string }) {
    return this.request<{ access_token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Users endpoints
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async getUser(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async createUser(data: { username: string; email: string; password: string }) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: Partial<{ username: string; email: string }>) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Products endpoints
  async getProducts() {
    return this.request<any[]>('/products');
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`);
  }

  async createProduct(data: any) {
    return this.request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any) {
    return this.request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders endpoints
  async getOrders() {
    return this.request<any[]>('/orders');
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
