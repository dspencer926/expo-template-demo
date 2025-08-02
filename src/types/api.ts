export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: ApiError[];
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  skipAuth?: boolean;
  skipRefresh?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

export interface OfflineQueueItem {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface RequestInterceptor {
  id: string;
  request: (config: any) => any | Promise<any>;
  error?: (error: any) => any | Promise<any>;
}

export interface ResponseInterceptor {
  id: string;
  response: (response: any) => any | Promise<any>;
  error?: (error: any) => any | Promise<any>;
}

export interface ApiEndpoints {
  auth: {
    login: string;
    register: string;
    refresh: string;
    logout: string;
    resetPassword: string;
    confirmResetPassword: string;
    changePassword: string;
    profile: string;
    mfa: {
      setup: string;
      verify: string;
      disable: string;
    };
  };
  users: {
    list: string;
    detail: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
  uploads: {
    image: string;
    file: string;
    avatar: string;
  };
}
