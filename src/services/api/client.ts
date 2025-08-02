import NetInfo from '@react-native-community/netinfo';
import { TokenStorageService } from '../auth/tokenStorage';
import { ApiResponse, ApiRequestConfig, OfflineQueueItem, NetworkState } from '@/types/api';
import { ENV } from '@/constants/environment';
import { secureStorage } from '../storage/secureStorage';

export interface ApiClientOptions {
  baseURL: string;
  timeout: number;
  defaultHeaders: Record<string, string>;
  enableOfflineQueue: boolean;
  maxRetries: number;
  retryDelay: number;
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private enableOfflineQueue: boolean;
  private maxRetries: number;
  private retryDelay: number;
  private offlineQueue: OfflineQueueItem[] = [];
  private networkState: NetworkState = {
    isConnected: true,
    isInternetReachable: true,
    type: null,
  };
  private isRefreshing = false;
  private failedQueue: {
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }[] = [];

  constructor(options: Partial<ApiClientOptions> = {}) {
    this.baseURL = options.baseURL || `${ENV.API_BASE_URL}/${ENV.API_VERSION}`;
    this.timeout = options.timeout || ENV.API_TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.defaultHeaders,
    };
    this.enableOfflineQueue = options.enableOfflineQueue ?? true;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;

    this.initializeNetworkListener();
    this.loadOfflineQueue();
  }

  private initializeNetworkListener(): void {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.networkState.isConnected;

      this.networkState = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      };

      if (wasOffline && this.networkState.isConnected) {
        this.processOfflineQueue();
      }
    });
  }

  private async loadOfflineQueue(): Promise<void> {
    try {
      const queue = await secureStorage.getObject<OfflineQueueItem[]>('offline_queue');
      if (queue) {
        this.offlineQueue = queue;
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  private async saveOfflineQueue(): Promise<void> {
    try {
      await secureStorage.setObject('offline_queue', this.offlineQueue);
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async addToOfflineQueue(
    url: string,
    method: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<void> {
    if (!this.enableOfflineQueue) return;

    const queueItem: OfflineQueueItem = {
      id: this.generateRequestId(),
      url,
      method: method as any,
      data,
      headers: headers || {},
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: this.maxRetries,
    };

    this.offlineQueue.push(queueItem);
    await this.saveOfflineQueue();
  }

  private async processOfflineQueue(): Promise<void> {
    if (!this.networkState.isConnected || this.offlineQueue.length === 0) {
      return;
    }

    const queueCopy = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const item of queueCopy) {
      try {
        await this.executeRequest(item.url, {
          method: item.method,
          body: item.data ? JSON.stringify(item.data) : null,
          headers: item.headers || {},
        });
      } catch (error) {
        item.retryCount++;
        if (item.retryCount < item.maxRetries) {
          this.offlineQueue.push(item);
        }
      }
    }

    await this.saveOfflineQueue();
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = await TokenStorageService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.executeRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: this.defaultHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      const { accessToken, expiresAt } = data.data;
      await TokenStorageService.updateAccessToken(accessToken, expiresAt);

      this.failedQueue.forEach(({ resolve }) => resolve(accessToken));
      this.failedQueue = [];

      return accessToken;
    } catch (error) {
      this.failedQueue.forEach(({ reject }) => reject(error));
      this.failedQueue = [];

      await TokenStorageService.clearTokens();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private async executeRequest(
    url: string,
    options: RequestInit,
    retryCount = 0
  ): Promise<Response> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        await this.delay(this.calculateRetryDelay(retryCount));
        return this.executeRequest(url, options, retryCount + 1);
      }

      throw error;
    }
  }

  private shouldRetry(error: any): boolean {
    if (!this.networkState.isConnected) return false;

    const retryableErrors = [
      'network request failed',
      'timeout',
      'connection',
      'enotfound',
      'econnreset',
    ];

    const errorMessage = error.message?.toLowerCase() || '';
    return retryableErrors.some(msg => errorMessage.includes(msg));
  }

  private calculateRetryDelay(retryCount: number): number {
    return this.retryDelay * Math.pow(2, retryCount);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async request<T = any>(
    url: string,
    config: ApiRequestConfig & { method?: string; data?: any } = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      data,
      headers = {},
      skipAuth = false,
      skipRefresh = false,
      timeout = this.timeout,
      ...restConfig
    } = config;

    const requestHeaders = { ...this.defaultHeaders, ...headers };

    if (!skipAuth) {
      const accessToken = await TokenStorageService.getAccessToken();
      if (accessToken) {
        requestHeaders['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      body: data ? JSON.stringify(data) : null,
    };

    if (!this.networkState.isConnected && this.enableOfflineQueue) {
      await this.addToOfflineQueue(url, method, data, requestHeaders);
      throw new Error('Device is offline. Request queued for later.');
    }

    try {
      const response = await this.executeRequest(url, requestOptions);

      if (response.status === 401 && !skipAuth && !skipRefresh) {
        try {
          const newAccessToken = await this.refreshAccessToken();
          requestHeaders['Authorization'] = `Bearer ${newAccessToken}`;

          const retryResponse = await this.executeRequest(url, {
            ...requestOptions,
            headers: requestHeaders,
          });

          return this.handleResponse<T>(retryResponse);
        } catch (refreshError) {
          throw new Error('Authentication failed');
        }
      }

      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (!this.networkState.isConnected && this.enableOfflineQueue) {
        await this.addToOfflineQueue(url, method, data, requestHeaders);
      }
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(data.message || `HTTP ${response.status}`);
      (error as any).status = response.status;
      (error as any).data = data;
      throw error;
    }

    return data;
  }

  async get<T = any>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  async post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', data });
  }

  async put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', data });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PATCH', data });
  }

  async delete<T = any>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  getNetworkState(): NetworkState {
    return this.networkState;
  }

  getOfflineQueueLength(): number {
    return this.offlineQueue.length;
  }

  async clearOfflineQueue(): Promise<void> {
    this.offlineQueue = [];
    await this.saveOfflineQueue();
  }
}

export const apiClient = new ApiClient();
