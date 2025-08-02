import { secureStorage } from '../storage/secureStorage';
import { AuthTokens } from '@/types/auth';

export class TokenStorageService {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly TOKENS_KEY = 'auth_tokens';

  static async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      await secureStorage.setObject(this.TOKENS_KEY, tokens, {
        requireAuthentication: false,
      });

      await secureStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken, {
        requireAuthentication: false,
      });

      await secureStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken, {
        requireAuthentication: true,
      });
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw new Error('Token storage failed');
    }
  }

  static async getTokens(): Promise<AuthTokens | null> {
    try {
      return await secureStorage.getObject<AuthTokens>(this.TOKENS_KEY);
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      return null;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  static async updateAccessToken(accessToken: string, expiresAt: number): Promise<void> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) {
        throw new Error('No existing tokens found');
      }

      const updatedTokens: AuthTokens = {
        ...tokens,
        accessToken,
        expiresAt,
      };

      await this.storeTokens(updatedTokens);
    } catch (error) {
      console.error('Failed to update access token:', error);
      throw new Error('Access token update failed');
    }
  }

  static async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        secureStorage.removeItem(this.TOKENS_KEY),
        secureStorage.removeItem(this.ACCESS_TOKEN_KEY),
        secureStorage.removeItem(this.REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
      throw new Error('Token clearing failed');
    }
  }

  static async hasValidTokens(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) {
        return false;
      }

      const now = Date.now();
      const bufferTime = 5 * 60 * 1000;

      return tokens.expiresAt > now + bufferTime;
    } catch (error) {
      console.error('Failed to check token validity:', error);
      return false;
    }
  }

  static async isTokenExpired(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) {
        return true;
      }

      return tokens.expiresAt <= Date.now();
    } catch (error) {
      console.error('Failed to check token expiration:', error);
      return true;
    }
  }

  static async getTokenExpirationTime(): Promise<number | null> {
    try {
      const tokens = await this.getTokens();
      return tokens?.expiresAt ?? null;
    } catch (error) {
      console.error('Failed to get token expiration time:', error);
      return null;
    }
  }

  static async hasRefreshToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      return !!refreshToken;
    } catch (error) {
      console.error('Failed to check refresh token:', error);
      return false;
    }
  }
}
