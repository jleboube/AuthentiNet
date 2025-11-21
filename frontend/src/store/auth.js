import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  loading: true,
  setAuth: ({ token, user }) => {
    localStorage.setItem('authentinet.auth', JSON.stringify({ token, user }));
    set({ token, user, loading: false });
  },
  clear: () => {
    localStorage.removeItem('authentinet.auth');
    set({ token: null, user: null, loading: false });
  },
  hydrate: () => {
    const raw = localStorage.getItem('authentinet.auth');
    if (!raw) return set({ loading: false });
    try {
      const parsed = JSON.parse(raw);
      set({ token: parsed.token, user: parsed.user, loading: false });
    } catch (e) {
      console.error('Failed to hydrate auth store', e);
      set({ loading: false });
    }
  },
  updateUser: (user) => {
    const raw = localStorage.getItem('authentinet.auth');
    const parsed = raw ? JSON.parse(raw) : {};
    const token = parsed.token;
    localStorage.setItem('authentinet.auth', JSON.stringify({ token, user }));
    set({ user });
  }
}));
