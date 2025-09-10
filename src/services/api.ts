interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    success: boolean;
    statusText: string;
    headers: Record<string, string>;
    config: RequestInit;
  }
  
  interface ApiErrorResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }
  
  interface ApiError<T = unknown> extends Error {
    response?: ApiErrorResponse<T>;
  }
  
  interface ApiConfig extends RequestInit {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    signal?: AbortSignal;
  }

  interface ApiServiceConfig {
    baseURL: string;
    headers?: Record<string, string>;
  }
  
  type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  
  export class Api {
    private baseURL: string;
    private defaultHeaders: Record<string, string>;
  
    constructor(config: ApiServiceConfig) {
      this.baseURL = config.baseURL;
      this.defaultHeaders = {
        'Content-Type': 'application/json',
        ...config.headers,
      };
    }
  
    private async request<T = unknown>(
      method: HttpMethod,
      url: string,
      data: unknown = null,
      config: ApiConfig = {},
    ): Promise<ApiResponse<T>> {
      const finalURL = this.baseURL + url;
      const urlWithParams = new URL(finalURL);
  
      if (config.params) {
        Object.keys(config.params).forEach(key => {
          const value = config.params![key];
          if (value !== null && value !== undefined) {
            urlWithParams.searchParams.append(key, String(value));
          }
        });
      }
  
      const headers = {
        ...this.defaultHeaders,
        ...config.headers,
      };
      
      const options: RequestInit = {
        method,
        headers,
        signal: config.signal,
        ...config,
      };
  
      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }
  
      try {
        const response = await fetch(urlWithParams.toString(), options);
        
        let responseData: unknown = null;
        const contentType = response.headers.get('content-type');
        
        if (response.status !== 204) {
          if (contentType?.includes('application/json')) {
            responseData = await response.json();
          } else if (contentType?.includes('image/')) {
            responseData = await response.arrayBuffer();
          } else {
            responseData = await response.text();
          }
        }
  
        if (!response.ok) {
          const errorMessage = `Request failed with status ${response.status}: ${response.statusText}`;
          const error: ApiError<unknown> = new Error(errorMessage);
          error.response = {
            data: responseData,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
          };
          throw error;
        }
  
        return {
          data: responseData as T,
          status: response.status,
          success: response.ok,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          config: options,
        };
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log(`Request to ${url} aborted.`);
        } else {
          const apiError = error as ApiError<unknown>;
          console.error(
            `[API Fetch Error] ${method} ${url}:`,
            apiError.response || (apiError instanceof Error ? apiError.message : 'An unexpected error occurred'),
          );
        }
        throw error;
      }
    }
  
    public get<T>(url: string, config?: ApiConfig) {
      return this.request<T>('GET', url, null, config);
    }
  
    public post<T, D>(url: string, data: D, config?: ApiConfig) {
      return this.request<T>('POST', url, data, config);
    }
  
    public put<T, D>(url: string, data: D, config?: ApiConfig) {
      return this.request<T>('PUT', url, data, config);
    }
      
    public patch<T, D>(url: string, data: D, config?: ApiConfig) {
      return this.request<T>('PATCH', url, data, config);
    }
  
    public delete<T>(url: string, config?: ApiConfig) {
      return this.request<T>('DELETE', url, null, config);
    }
  }