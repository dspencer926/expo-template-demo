import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  AuthState,
  AuthContextType,
  User,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  ResetPasswordConfirm,
  ChangePasswordRequest,
  MFASetup,
  MFAVerification,
  BiometricAuthConfig,
} from '@/types/auth';
import { TokenStorageService } from '@/services/auth/tokenStorage';
import { BiometricAuthService } from '@/services/auth/biometricAuth';
import { apiClient } from '@/services/api/client';
import { queryClient } from '@/services/api/queryClient';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKENS'; payload: AuthTokens | null }
  | { type: 'SET_BIOMETRIC_CONFIG'; payload: BiometricAuthConfig }
  | { type: 'SET_MFA_REQUIRED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  biometricAuth: {
    isEnabled: false,
    type: 'none',
    isEnrolled: false,
  },
  mfaRequired: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload, isLoading: false };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
      };

    case 'SET_TOKENS':
      return { ...state, tokens: action.payload };

    case 'SET_BIOMETRIC_CONFIG':
      return { ...state, biometricAuth: action.payload };

    case 'SET_MFA_REQUIRED':
      return { ...state, mfaRequired: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'LOGOUT':
      return {
        ...initialState,
        isInitialized: true,
        isLoading: false,
        biometricAuth: state.biometricAuth,
      };

    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!state.user?.permissions) return false;

      return state.user.permissions.some(
        permission => permission.resource === resource && permission.action === action
      );
    },
    [state.user]
  );

  const hasRole = useCallback(
    (roleName: string): boolean => {
      if (!state.user?.role) return false;
      return state.user.role.name === roleName;
    },
    [state.user]
  );

  const initializeAuth = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const biometricConfig = await BiometricAuthService.getBiometricConfig();
      dispatch({ type: 'SET_BIOMETRIC_CONFIG', payload: biometricConfig });

      await BiometricAuthService.checkBiometricChanges();

      const tokens = await TokenStorageService.getTokens();
      if (!tokens) {
        dispatch({ type: 'SET_INITIALIZED', payload: true });
        return;
      }

      const isTokenValid = await TokenStorageService.hasValidTokens();
      if (!isTokenValid) {
        try {
          await refreshAuth();
        } catch (error) {
          await TokenStorageService.clearTokens();
          dispatch({ type: 'SET_INITIALIZED', payload: true });
          return;
        }
      }

      dispatch({ type: 'SET_TOKENS', payload: tokens });

      const profileResponse = await apiClient.get('/auth/profile');
      dispatch({ type: 'SET_USER', payload: profileResponse.data });
    } catch (error: any) {
      console.error('Auth initialization failed:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        clearError();

        const response = await apiClient.post('/auth/login', credentials, {
          skipAuth: true,
        });

        const { user, tokens, mfaRequired } = response.data;

        if (mfaRequired) {
          dispatch({ type: 'SET_MFA_REQUIRED', payload: true });
          return;
        }

        await TokenStorageService.storeTokens(tokens);
        dispatch({ type: 'SET_TOKENS', payload: tokens });
        dispatch({ type: 'SET_USER', payload: user });

        if (credentials.rememberMe && state.biometricAuth.isEnabled) {
          await BiometricAuthService.updateBiometricCredentials({
            email: credentials.email,
            accessToken: tokens.accessToken,
          });
        }
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.biometricAuth.isEnabled, clearError]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        clearError();

        const response = await apiClient.post('/auth/register', credentials, {
          skipAuth: true,
        });

        const { user, tokens } = response.data;

        await TokenStorageService.storeTokens(tokens);
        dispatch({ type: 'SET_TOKENS', payload: tokens });
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [clearError]
  );

  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.warn('Logout request failed:', error);
      }

      await TokenStorageService.clearTokens();
      queryClient.clear();
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      console.error('Logout failed:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const refreshToken = await TokenStorageService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(
        '/auth/refresh',
        {
          refreshToken,
        },
        { skipAuth: true, skipRefresh: true }
      );

      const { accessToken, expiresAt } = response.data;
      await TokenStorageService.updateAccessToken(accessToken, expiresAt);

      const tokens = await TokenStorageService.getTokens();
      dispatch({ type: 'SET_TOKENS', payload: tokens });
    } catch (error: any) {
      await TokenStorageService.clearTokens();
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  }, []);

  const resetPassword = useCallback(
    async (request: ResetPasswordRequest) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        clearError();

        await apiClient.post('/auth/reset-password', request, {
          skipAuth: true,
        });
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [clearError]
  );

  const confirmResetPassword = useCallback(
    async (confirm: ResetPasswordConfirm) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        clearError();

        const response = await apiClient.post('/auth/confirm-reset-password', confirm, {
          skipAuth: true,
        });

        const { user, tokens } = response.data;

        await TokenStorageService.storeTokens(tokens);
        dispatch({ type: 'SET_TOKENS', payload: tokens });
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [clearError]
  );

  const changePassword = useCallback(
    async (request: ChangePasswordRequest) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        clearError();

        await apiClient.post('/auth/change-password', request);
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [clearError]
  );

  const enableBiometricAuth = useCallback(async () => {
    try {
      if (!state.user || !state.tokens) {
        throw new Error('User must be authenticated');
      }

      await BiometricAuthService.enableBiometricAuth({
        email: state.user.email,
        accessToken: state.tokens.accessToken,
      });

      const biometricConfig = await BiometricAuthService.getBiometricConfig();
      dispatch({ type: 'SET_BIOMETRIC_CONFIG', payload: biometricConfig });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.user, state.tokens]);

  const disableBiometricAuth = useCallback(async () => {
    try {
      await BiometricAuthService.disableBiometricAuth();

      const biometricConfig = await BiometricAuthService.getBiometricConfig();
      dispatch({ type: 'SET_BIOMETRIC_CONFIG', payload: biometricConfig });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const authenticateWithBiometrics = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      clearError();

      const credentials = await BiometricAuthService.getBiometricCredentials();
      if (!credentials) {
        throw new Error('Biometric authentication failed');
      }

      const response = await apiClient.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      dispatch({ type: 'SET_USER', payload: response.data });

      const tokens = await TokenStorageService.getTokens();
      dispatch({ type: 'SET_TOKENS', payload: tokens });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [clearError]);

  const setupMFA = useCallback(async (): Promise<MFASetup> => {
    try {
      const response = await apiClient.post('/auth/mfa/setup');
      return response.data;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const verifyMFA = useCallback(
    async (verification: MFAVerification) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        clearError();

        const response = await apiClient.post('/auth/mfa/verify', verification);
        const { user, tokens } = response.data;

        await TokenStorageService.storeTokens(tokens);
        dispatch({ type: 'SET_TOKENS', payload: tokens });
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_MFA_REQUIRED', payload: false });
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [clearError]
  );

  const disableMFA = useCallback(
    async (code: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        clearError();

        await apiClient.post('/auth/mfa/disable', { code });

        const profileResponse = await apiClient.get('/auth/profile');
        dispatch({ type: 'SET_USER', payload: profileResponse.data });
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [clearError]
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
    resetPassword,
    confirmResetPassword,
    changePassword,
    enableBiometricAuth,
    disableBiometricAuth,
    authenticateWithBiometrics,
    setupMFA,
    verifyMFA,
    disableMFA,
    hasPermission,
    hasRole,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
