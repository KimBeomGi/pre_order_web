// persist 사용 확인을 위해서 임시 파일
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tokens, User } from '@/types/auth';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  token: Tokens | null;
  login: (userData: User, token: Tokens) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: (userData, token) =>
        set({
          user: userData,
          isAuthenticated: true,
          token,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;