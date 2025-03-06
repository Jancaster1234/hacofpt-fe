// src/store/authStore.ts

import { create } from "zustand";
import { User } from "@/types/entities/users";
interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setAuth: (data: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  setAuth: (data) => set((state) => ({ ...state, ...data })),
}));
