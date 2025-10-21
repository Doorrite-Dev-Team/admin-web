import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        cookieStore.delete("access-token-user");
        cookieStore.delete("refresh_token_user");
        set({ user: null });
      },
    }),
    { name: "auth-storage" },
  ),
);
