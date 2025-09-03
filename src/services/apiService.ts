// API Service for connecting to backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Authentication endpoints
  async login(email: string, password: string, role?: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password, role }),
    });

    const data = await this.handleResponse(response);
    
    if (data.success && data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async signup(name: string, email: string, password: string, role: string, subtype?: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ name, email, password, role, subtype }),
    });

    const data = await this.handleResponse(response);
    
    if (data.success && data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateProfile(updates: any) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }

  // Waste request endpoints
  async getWasteRequests(params?: any) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/waste/requests?${searchParams}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getPendingWasteRequests() {
    const response = await fetch(`${API_BASE_URL}/waste/requests/pending`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getMyWasteRequests() {
    const response = await fetch(`${API_BASE_URL}/waste/requests/my`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createWasteRequest(requestData: any) {
    const response = await fetch(`${API_BASE_URL}/waste/requests`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(requestData),
    });

    return this.handleResponse(response);
  }

  async acceptWasteRequest(requestId: string, scheduledDate: string) {
    const response = await fetch(`${API_BASE_URL}/waste/requests/${requestId}/accept`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ scheduledDate }),
    });

    return this.handleResponse(response);
  }

  async completeWasteRequest(requestId: string, actualPrice?: number) {
    const response = await fetch(`${API_BASE_URL}/waste/requests/${requestId}/complete`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ actualPrice }),
    });

    return this.handleResponse(response);
  }

  async updateWasteRequestStatus(requestId: string, status: string, updates?: any) {
    const response = await fetch(`${API_BASE_URL}/waste/requests/${requestId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, updates }),
    });

    return this.handleResponse(response);
  }

  async deleteWasteRequest(requestId: string) {
    const response = await fetch(`${API_BASE_URL}/waste/requests/${requestId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // DIY Product endpoints
  async getDIYProducts(params?: any) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async getDIYProduct(productId: string) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async getMyDIYProducts() {
    const response = await fetch(`${API_BASE_URL}/products/seller/my`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createDIYProduct(productData: any) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(productData),
    });

    return this.handleResponse(response);
  }

  async updateDIYProduct(productId: string, updates: any) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }

  async likeDIYProduct(productId: string) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/like`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createOrder(productId: string, orderData: any) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/order`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(orderData),
    });

    return this.handleResponse(response);
  }

  async deleteDIYProduct(productId: string) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // User endpoints
  async getUsers(params?: any) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/users?${searchParams}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getUserStats(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateUser(userId: string, updates: any) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }

  async updateUserGreenCoins(userId: string, amount: number, type: 'add' | 'deduct', description: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/green-coins`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, type, description }),
    });

    return this.handleResponse(response);
  }

  // Collector endpoints
  async getCollectors(params?: any) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/collectors?${searchParams}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getCollectorProfile() {
    const response = await fetch(`${API_BASE_URL}/collectors/profile`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getCollectorStats() {
    const response = await fetch(`${API_BASE_URL}/collectors/stats`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createCollectorProfile(profileData: any) {
    const response = await fetch(`${API_BASE_URL}/collectors/profile`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData),
    });

    return this.handleResponse(response);
  }

  async updateCollectorProfile(updates: any) {
    const response = await fetch(`${API_BASE_URL}/collectors/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }

  async getCollectorRequests(status?: string) {
    const params = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/collectors/requests${params}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateCollectorStatus(isActive: boolean) {
    const response = await fetch(`${API_BASE_URL}/collectors/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ isActive }),
    });

    return this.handleResponse(response);
  }

  // Analytics endpoints
  async getAnalytics(timeframe?: string) {
    const params = timeframe ? `?timeframe=${timeframe}` : '';
    const response = await fetch(`${API_BASE_URL}/analytics${params}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getUserAnalytics(userId: string) {
    const response = await fetch(`${API_BASE_URL}/analytics/user/${userId}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getCollectorAnalytics(collectorId: string) {
    const response = await fetch(`${API_BASE_URL}/analytics/collector/${collectorId}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
