// Cliente para consumir las APIs del backoffice
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Métodos específicos para el backoffice
  async getMetrics() {
    return this.get('/metrics');
  }

  async getEvents() {
    return this.get('/events');
  }

  async getNotifications() {
    return this.get('/notifications');
  }

  async createEvent(event: any) {
    return this.post('/events', event);
  }
}

export const apiClient = new ApiClient();
