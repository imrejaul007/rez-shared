import axios, { AxiosInstance, AxiosError } from 'axios';

export const AUTH_HEADER = 'Authorization';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const ACCESS_TOKEN_KEY = 'access_token';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface SecureStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export class BrowserSecureStore implements SecureStore {
  async get(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  }

  async remove(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
}

export class CookieSecureStore implements SecureStore {
  constructor(private secure = true, private sameSite = 'Strict') {}

  async get(key: string): Promise<string | null> {
    if (typeof document === 'undefined') return null;
    const name = `${key}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
    return null;
  }

  async set(key: string, value: string): Promise<void> {
    if (typeof document === 'undefined') return;
    const path = '; path=/';
    const secure = this.secure ? '; Secure' : '';
    const sameSite = `; SameSite=${this.sameSite}`;
    document.cookie = `${key}=${encodeURIComponent(value)}${path}${secure}${sameSite}`;
  }

  async remove(key: string): Promise<void> {
    if (typeof document === 'undefined') return;
    await this.set(key, '');
  }
}

export class TokenManager {
  constructor(private store: SecureStore, private apiClient: AxiosInstance) {
    this.setupInterceptor();
  }

  async getAccessToken(): Promise<string | null> {
    return this.store.get(ACCESS_TOKEN_KEY);
  }

  async setTokens(tokens: Tokens): Promise<void> {
    await this.store.set(ACCESS_TOKEN_KEY, tokens.accessToken);
    await this.store.set(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  async refreshAccessToken(refreshUrl: string): Promise<string> {
    const refreshToken = await this.store.get(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.apiClient.post(refreshUrl, {
      refreshToken,
    });

    const newTokens: Tokens = response.data;
    await this.setTokens(newTokens);
    return newTokens.accessToken;
  }

  async logout(): Promise<void> {
    await this.store.remove(ACCESS_TOKEN_KEY);
    await this.store.remove(REFRESH_TOKEN_KEY);
  }

  private setupInterceptor(): void {
    // Request interceptor: add auth header
    this.apiClient.interceptors.request.use(async (config) => {
      const token = await this.getAccessToken();
      if (token) {
        config.headers[AUTH_HEADER] = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor: handle 401
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && originalRequest) {
          try {
            const newToken = await this.refreshAccessToken('/auth/refresh');
            originalRequest.headers[AUTH_HEADER] = `Bearer ${newToken}`;
            return this.apiClient(originalRequest);
          } catch {
            await this.logout();
            throw error;
          }
        }
        throw error;
      },
    );
  }
}
