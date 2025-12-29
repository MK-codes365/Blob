import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
};

const SESSION_TOKEN_KEY = 'blob.sessionToken';
const SESSION_USER_KEY = 'blob.sessionUser';

export interface AuthState {
  isAuthenticated: boolean;
  sessionToken: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;

  setSession: (args: { sessionToken: string; user: AuthUser }) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  sessionToken: null,
  user: null,
  hasHydrated: false,

  setSession: async ({ sessionToken, user }) => {
    await SecureStore.setItemAsync(SESSION_TOKEN_KEY, sessionToken);
    await SecureStore.setItemAsync(SESSION_USER_KEY, JSON.stringify(user));
    set({ isAuthenticated: true, sessionToken, user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
    await SecureStore.deleteItemAsync(SESSION_USER_KEY);
    set({ isAuthenticated: false, sessionToken: null, user: null });
  },

  hydrate: async () => {
    if (get().hasHydrated) return;

    const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(SESSION_USER_KEY);
    const user = userJson ? (JSON.parse(userJson) as AuthUser) : null;

    set({
      hasHydrated: true,
      isAuthenticated: Boolean(token),
      sessionToken: token,
      user,
    });
  },
}));
