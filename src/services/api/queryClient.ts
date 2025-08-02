import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { ApiResponse } from '@/types/api';
import { enableLogging } from '@/constants/environment';

const defaultOptions: DefaultOptions = {
  queries: {
    retry: (failureCount, error: any) => {
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  mutations: {
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
};

export const queryClient = new QueryClient({
  defaultOptions,
});

export const queryKeys = {
  auth: {
    profile: ['auth', 'profile'] as const,
    permissions: ['auth', 'permissions'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },
} as const;

export const invalidateQueries = {
  auth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile }),
  users: {
    all: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
    detail: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) }),
  },
  posts: {
    all: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
    detail: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) }),
  },
};

export const optimisticUpdate = {
  updateUser: <T>(userId: string, updater: (old: T) => T) => {
    queryClient.setQueryData<ApiResponse<T>>(queryKeys.users.detail(userId), old =>
      old ? { ...old, data: updater(old.data) } : undefined
    );
  },

  addToList: <T>(queryKey: readonly unknown[], newItem: T, position: 'start' | 'end' = 'start') => {
    queryClient.setQueryData<ApiResponse<T[]>>(queryKey, old => {
      if (!old) return undefined;
      const newData = position === 'start' ? [newItem, ...old.data] : [...old.data, newItem];
      return { ...old, data: newData };
    });
  },

  removeFromList: <T extends { id: string }>(queryKey: readonly unknown[], itemId: string) => {
    queryClient.setQueryData<ApiResponse<T[]>>(queryKey, old => {
      if (!old) return undefined;
      return { ...old, data: old.data.filter(item => item.id !== itemId) };
    });
  },

  updateInList: <T extends { id: string }>(
    queryKey: readonly unknown[],
    itemId: string,
    updater: (old: T) => T
  ) => {
    queryClient.setQueryData<ApiResponse<T[]>>(queryKey, old => {
      if (!old) return undefined;
      return {
        ...old,
        data: old.data.map(item => (item.id === itemId ? updater(item) : item)),
      };
    });
  },
};

export const prefetchQueries = {
  userDetail: (id: string) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.users.detail(id),
      queryFn: () => {
        // This would be replaced with actual API call
        throw new Error('API implementation needed');
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },
};

export type QueryKey = typeof queryKeys;
export type InvalidateQueries = typeof invalidateQueries;
export type OptimisticUpdate = typeof optimisticUpdate;
